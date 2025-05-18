import { Action, ActionPanel, List } from "@raycast/api";
import { getCmd } from "./core/commands";
import { useCommandHistory } from "./core/history";
import { allModels } from "./core/models";
import { HistoryItem } from "./core/types"; // ADDED for clarity
import {
  calculateAggregatedStatsForGroup,
  groupHistoryByKey,
  GroupStats,
  oneHourAgo,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from "./core/utils";

// Interface for sub-group statistics (e.g., models used per command)
interface SubGroupStatItem {
  name: string; // Model name or Command name
  count: number;
  totalTokens: number;
}

// Updated formatting function to include sub-group details
function formatDetailedStatsMarkdown(
  title: string,
  mainStats: GroupStats,
  subGroupTitle?: string,
  subGroupItems?: SubGroupStatItem[],
): string {
  if (mainStats.count === 0) {
    return `### ${title}\n\nNo data for this period or category.`;
  }

  let markdown =
    `### ${title}\n\n` +
    `* **Number of requests:** ${mainStats.count.toLocaleString()}\n` +
    `* **Total cost:** $${mainStats.totalCost.toFixed(4)}\n` +
    `* **Total tokens:** ${mainStats.totalTokens.toLocaleString()}\n` +
    `* **Average tokens per request:** ${parseInt(mainStats.avgTotalTokens.toFixed(0)).toLocaleString()}\n` +
    `* **Response time (avg):** ~${mainStats.avgTotalTime.toFixed(2)} sec`;

  if (subGroupTitle && subGroupItems && subGroupItems.length > 0) {
    markdown += `\n\n**${subGroupTitle}**\n`;
    // Sort subGroupItems by count, descending, for consistent display
    const sortedSubGroupItems = [...subGroupItems].sort((a, b) => b.count - a.count);
    for (const item of sortedSubGroupItems) {
      markdown += `*   ${item.name}: ${item.count.toLocaleString()} uses, ${item.totalTokens.toLocaleString()} tokens\n`;
    }
  } else if (subGroupTitle) {
    // SubGroupTitle was provided, but items were empty or undefined
    markdown += `\n\n**${subGroupTitle}**\nNo specific data available for this breakdown.`;
  }

  return markdown;
}

export default function StatsCommand() {
  const { history, isLoading } = useCommandHistory();

  const totalStats = calculateAggregatedStatsForGroup(history);

  const hour = oneHourAgo();
  const today = startOfToday();
  const yesterday = startOfYesterday();
  const thisWeek = startOfWeek();
  const thisMonth = startOfMonth();

  const hourHistory = history.filter((item) => new Date(item.timestamp) >= hour);
  const todayHistory = history.filter((item) => new Date(item.timestamp) >= today);
  const yesterdayHistory = history.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= yesterday && itemDate < today;
  });
  const thisWeekHistory = history.filter((item) => new Date(item.timestamp) >= thisWeek);
  const thisMonthHistory = history.filter((item) => new Date(item.timestamp) >= thisMonth);

  const hourStats = calculateAggregatedStatsForGroup(hourHistory);
  const todayStats = calculateAggregatedStatsForGroup(todayHistory);
  const yesterdayStats = calculateAggregatedStatsForGroup(yesterdayHistory);
  const thisWeekStats = calculateAggregatedStatsForGroup(thisWeekHistory);
  const thisMonthStats = calculateAggregatedStatsForGroup(thisMonthHistory);

  // --- Calculate stats grouped by Action Name with model breakdown ---
  const statsByActionNameDetailed: {
    actionName: string;
    mainStats: GroupStats;
    modelSubGroupItems: SubGroupStatItem[];
  }[] = [];
  const groupedByAction = groupHistoryByKey(history, "actionName");

  for (const actionName in groupedByAction) {
    if (Object.prototype.hasOwnProperty.call(groupedByAction, actionName) && groupedByAction[actionName].length > 0) {
      const commandHistoryItems: HistoryItem[] = groupedByAction[actionName];
      const commandMainStats = calculateAggregatedStatsForGroup(commandHistoryItems);

      // Sub-group these items by model
      const modelsUsedMap: Record<string, HistoryItem[]> = {}; // modelId -> HistoryItem[]
      for (const item of commandHistoryItems) {
        const modelId = item.model || "unknown_model"; // Fallback for undefined model
        if (!modelsUsedMap[modelId]) {
          modelsUsedMap[modelId] = [];
        }
        modelsUsedMap[modelId].push(item);
      }

      const modelSubGroupItems: SubGroupStatItem[] = Object.entries(modelsUsedMap).map(([modelId, items]) => {
        const modelGroupStats = calculateAggregatedStatsForGroup(items);
        return {
          name: allModels[modelId]?.name || modelId, // Get friendly name or use ID
          count: modelGroupStats.count,
          totalTokens: modelGroupStats.totalTokens,
        };
      });

      statsByActionNameDetailed.push({
        actionName,
        mainStats: commandMainStats,
        modelSubGroupItems,
      });
    }
  }
  statsByActionNameDetailed.sort((a, b) => b.mainStats.count - a.mainStats.count); // Sort commands by overall usage

  // --- Calculate stats grouped by Model with command breakdown ---
  const statsByModelDetailed: {
    modelId: string;
    modelName: string;
    mainStats: GroupStats;
    commandSubGroupItems: SubGroupStatItem[];
  }[] = [];
  const groupedByModel = groupHistoryByKey(history, "model");

  for (const modelId in groupedByModel) {
    if (Object.prototype.hasOwnProperty.call(groupedByModel, modelId) && groupedByModel[modelId].length > 0) {
      const modelHistoryItems: HistoryItem[] = groupedByModel[modelId];
      const modelMainStats = calculateAggregatedStatsForGroup(modelHistoryItems);
      const modelName = allModels[modelId]?.name || modelId; // Get friendly name or use ID

      // Sub-group these items by actionName
      const commandsUsedMap: Record<string, HistoryItem[]> = {}; // actionName -> HistoryItem[]
      for (const item of modelHistoryItems) {
        const commandId = item.actionName || "unknown_command"; // Fallback for undefined actionName
        if (!commandsUsedMap[commandId]) {
          commandsUsedMap[commandId] = [];
        }
        commandsUsedMap[commandId].push(item);
      }

      const commandSubGroupItems: SubGroupStatItem[] = Object.entries(commandsUsedMap).map(([commandId, items]) => {
        const commandGroupStats = calculateAggregatedStatsForGroup(items);
        return {
          name: getCmd(commandId).name, // Get friendly command name
          count: commandGroupStats.count,
          totalTokens: commandGroupStats.totalTokens,
        };
      });

      statsByModelDetailed.push({
        modelId,
        modelName,
        mainStats: modelMainStats,
        commandSubGroupItems,
      });
    }
  }
  statsByModelDetailed.sort((a, b) => b.mainStats.count - a.mainStats.count); // Sort models by overall usage

  const categories = [
    {
      id: "total",
      title: "Overall statistics",
      markdownStats: formatDetailedStatsMarkdown("Overall statistics", totalStats),
    },
    { id: "period-hour", title: "For hour", markdownStats: formatDetailedStatsMarkdown("For hour", hourStats) },
    { id: "period-today", title: "For today", markdownStats: formatDetailedStatsMarkdown("For today", todayStats) },
    {
      id: "period-yesterday",
      title: "Yesterday",
      markdownStats: formatDetailedStatsMarkdown("For yesterday", yesterdayStats),
    },
    {
      id: "period-week",
      title: "This week",
      markdownStats: formatDetailedStatsMarkdown("For this week", thisWeekStats),
    },
    {
      id: "period-month",
      title: "This month",
      markdownStats: formatDetailedStatsMarkdown("For this month", thisMonthStats),
    },

    ...statsByActionNameDetailed.map((item) => ({
      id: `command-${item.actionName}`,
      title: `Command: "${getCmd(item.actionName).name}"`,
      markdownStats: formatDetailedStatsMarkdown(
        `Statistics for Command: ${getCmd(item.actionName).name}`,
        item.mainStats,
        "Models Used:",
        item.modelSubGroupItems,
      ),
    })),

    ...statsByModelDetailed.map((item) => ({
      id: `model-${item.modelId.replace(/[^a-zA-Z0-9-_]/g, "_")}`, // Sanitize ID for key
      title: `Model: "${item.modelName}"`,
      markdownStats: formatDetailedStatsMarkdown(
        `Statistics for Model: ${item.modelName}`,
        item.mainStats,
        "Commands Executed:",
        item.commandSubGroupItems,
      ),
    })),
  ];

  return (
    <List isShowingDetail isLoading={isLoading} searchBarPlaceholder="Search by statistics categories">
      {categories.map((category) => (
        <List.Item
          key={category.id}
          title={category.title}
          detail={<List.Item.Detail markdown={category.markdownStats} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title={`Copy statistics for "${category.title}"`}
                content={category.markdownStats} // Copy the full detailed markdown
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

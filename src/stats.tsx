import { Action, ActionPanel, List } from "@raycast/api";
import { getCmd } from "./core/commands";
import { useCommandHistory } from "./core/history";
import { allModels } from "./core/models";
import { GroupStats, HistoryItem } from "./core/types"; // Keep import for type reference
import {
  calculateAggregatedStatsForGroup,
  DetailedSubGroupStatItem,
  getDetailedSubGroupStats,
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MONTH,
  MS_PER_WEEK,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from "./core/utils";

// Helper function to format statistics into a markdown string for the Detail view.
// It includes main statistics and optional detailed breakdowns for up to two sub-groups (e.g., commands and models).
function formatDetailedStatsMarkdown(
  title: string, // Title for the statistics section
  mainStats: GroupStats, // Aggregated stats for the main group (period, command, or model)
  subGroup1Title?: string, // Title for the first sub-group list (e.g., "Commands Executed:")
  subGroup1Items?: DetailedSubGroupStatItem[], // Detailed stats for items in the first sub-group
  subGroup2Title?: string, // Title for the second sub-group list (e.g., "Models Used:")
  subGroup2Items?: DetailedSubGroupStatItem[], // Detailed stats for items in the second sub-group
): string {
  // If main stats count is 0, display a simple message indicating no data
  if (mainStats.count === 0) {
    return `### ${title}\n\nNo data for this period or category.`;
  }

  // Build the main statistics section markdown
  let markdown =
    `## ${title}\n\n` +
    `* **Number of requests:** ${mainStats.count.toLocaleString()}\n` +
    `* **Total cost:** $${mainStats.totalCost.toFixed(4)}\n` + // Include total cost, fixed to 4 decimal places
    `* **Total tokens:** ${mainStats.totalTokens.toLocaleString()}\n` +
    `* **Average tokens per request:** ${parseInt(mainStats.avgTotalTokens.toFixed(0)).toLocaleString()}\n` + // Format average tokens as integer
    `* **Response time (avg):** ~${mainStats.avgTotalTime.toFixed(2)} sec`; // Include average response time, fixed to 2 decimal places

  // Helper to format a single detailed sub-group item into a nested markdown list
  const formatSubItem = (item: DetailedSubGroupStatItem) => {
    return `* **${item.name}**: ${item.count.toLocaleString()}; $${item.totalCost.toFixed(2)}; ~${item.avgTotalTime.toFixed(2)} sec.\n`;
  };

  // Handle the first sub-group if title and items are provided and items list is not empty
  if (subGroup1Title && subGroup1Items && subGroup1Items.length > 0) {
    markdown += `\n\n## ${subGroup1Title}\n`; // Add sub-group title
    for (const item of subGroup1Items) {
      markdown += formatSubItem(item); // Add formatted sub-item details
    }
  } else if (subGroup1Title) {
    // If title was provided but items were empty or undefined, show "No data" for this breakdown
    markdown += `\n\n**${subGroup1Title}**\nNo specific data available for this breakdown.`;
  }

  // Handle the second sub-group if title and items are provided and items list is not empty
  if (subGroup2Title && subGroup2Items && subGroup2Items.length > 0) {
    // Add a newline before the second sub-group for spacing, unless it's the very first section after main stats
    // This ensures there's a blank line between the first and second sub-group lists if both exist.
    if (
      (subGroup1Title && (subGroup1Items?.length ?? 0) > 0) ||
      (!subGroup1Title && (subGroup1Items?.length ?? 0) === 0 && mainStats.count > 0)
    ) {
      markdown += `\n`; // Add extra space between the two lists or after main stats if no first list
    }

    markdown += `## ${subGroup2Title}\n`; // Add sub-group title
    for (const item of subGroup2Items) {
      markdown += formatSubItem(item); // Add formatted sub-item details
    }
  } else if (subGroup2Title) {
    // If title was provided but items were empty or undefined, show "No data" for this breakdown
    markdown += `\n\n**${subGroup2Title}**\nNo specific data available for this breakdown.`;
  }

  return markdown;
}

export default function StatsCommand() {
  const { history, isLoading } = useCommandHistory();

  // --- Filter history for different time periods ---
  const now = Date.now();
  // Sliding Window Periods (using constants from utils)
  const hourHistory = history.filter((item) => now - item.timestamp <= MS_PER_HOUR);
  const last24HoursHistory = history.filter((item) => now - item.timestamp <= MS_PER_DAY);
  const last7DaysHistory = history.filter((item) => now - item.timestamp <= MS_PER_WEEK);
  const last30DaysHistory = history.filter((item) => now - item.timestamp <= MS_PER_MONTH);

  // Calendar Periods (Keep existing logic)
  const today = startOfToday();
  const todayHistory = history.filter((item) => new Date(item.timestamp) >= today);
  const yesterday = startOfYesterday();
  const yesterdayHistory = history.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= yesterday && itemDate < today;
  });
  const thisWeek = startOfWeek();
  const thisWeekHistory = history.filter((item) => new Date(item.timestamp) >= thisWeek);
  const thisMonth = startOfMonth();
  const thisMonthHistory = history.filter((item) => new Date(item.timestamp) >= thisMonth);

  // --- Calculate main aggregated stats for each period and overall ---
  const totalStats = calculateAggregatedStatsForGroup(history);
  const hourStats = calculateAggregatedStatsForGroup(hourHistory);
  const last24HoursStats = calculateAggregatedStatsForGroup(last24HoursHistory);
  const last7DaysStats = calculateAggregatedStatsForGroup(last7DaysHistory);
  const last30DaysStats = calculateAggregatedStatsForGroup(last30DaysHistory);
  const todayStats = calculateAggregatedStatsForGroup(todayHistory);
  const yesterdayStats = calculateAggregatedStatsForGroup(yesterdayHistory);
  const thisWeekStats = calculateAggregatedStatsForGroup(thisWeekHistory);
  const thisMonthStats = calculateAggregatedStatsForGroup(thisMonthHistory);

  // --- Calculate detailed sub-group stats (commands and models) for each period ---
  // Use the helper function getDetailedSubGroupStats to get sorted lists of commands/models with their stats within each period's history subset.
  const totalCommands = getDetailedSubGroupStats(history, "actionName");
  const totalModels = getDetailedSubGroupStats(history, "model");

  const hourCommands = getDetailedSubGroupStats(hourHistory, "actionName");
  const hourModels = getDetailedSubGroupStats(hourHistory, "model");

  const last24HoursCommands = getDetailedSubGroupStats(last24HoursHistory, "actionName");
  const last24HoursModels = getDetailedSubGroupStats(last24HoursHistory, "model");

  const last7DaysCommands = getDetailedSubGroupStats(last7DaysHistory, "actionName");
  const last7DaysModels = getDetailedSubGroupStats(last7DaysHistory, "model");

  const last30DaysCommands = getDetailedSubGroupStats(last30DaysHistory, "actionName");
  const last30DaysModels = getDetailedSubGroupStats(last30DaysHistory, "model");

  const todayCommands = getDetailedSubGroupStats(todayHistory, "actionName");
  const todayModels = getDetailedSubGroupStats(todayHistory, "model");

  const yesterdayCommands = getDetailedSubGroupStats(yesterdayHistory, "actionName");
  const yesterdayModels = getDetailedSubGroupStats(yesterdayHistory, "model");

  const thisWeekCommands = getDetailedSubGroupStats(thisWeekHistory, "actionName");
  const thisWeekModels = getDetailedSubGroupStats(thisWeekHistory, "model");

  const thisMonthCommands = getDetailedSubGroupStats(thisMonthHistory, "actionName");
  const thisMonthModels = getDetailedSubGroupStats(thisMonthHistory, "model");

  // --- Calculate stats grouped by Action Name with detailed model breakdown ---
  // Group the entire history by actionName, then for each command's history subset, get detailed model stats within that subset.
  const statsByActionNameDetailed: {
    actionName: string; // Original actionName key
    mainStats: GroupStats; // Stats for this command overall
    modelSubGroupItems: DetailedSubGroupStatItem[]; // Detailed stats for models used within this command
  }[] = [];
  // Using groupHistoryByKey directly here to iterate over command groups
  const groupedByAction = history.reduce(
    (acc, item) => {
      const key = item.actionName ?? "undefined_action";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  for (const actionName in groupedByAction) {
    if (Object.prototype.hasOwnProperty.call(groupedByAction, actionName) && groupedByAction[actionName].length > 0) {
      const commandHistoryItems: HistoryItem[] = groupedByAction[actionName]; // Get all history items for this command
      const commandMainStats = calculateAggregatedStatsForGroup(commandHistoryItems); // Calculate main stats for this command
      // Get detailed stats for models used *within* this command's history items using the helper
      const modelSubGroupItems = getDetailedSubGroupStats(commandHistoryItems, "model");
      statsByActionNameDetailed.push({
        actionName,
        mainStats: commandMainStats,
        modelSubGroupItems,
      });
    }
  }
  // Sort commands by overall usage count descending for display
  statsByActionNameDetailed.sort((a, b) => b.mainStats.count - a.mainStats.count);

  // --- Calculate stats grouped by Model with detailed command breakdown ---
  // Group the entire history by model, then for each model's history subset, get detailed command stats within that subset.
  const statsByModelDetailed: {
    modelId: string; // Original model ID key
    modelName: string; // Friendly model name
    mainStats: GroupStats; // Stats for this model overall
    commandSubGroupItems: DetailedSubGroupStatItem[]; // Detailed stats for commands used with this model
  }[] = [];
  // Using groupHistoryByKey directly here to iterate over model groups
  const groupedByModel = history.reduce(
    (acc, item) => {
      const key = item.model ?? "undefined_model";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  for (const modelId in groupedByModel) {
    if (Object.prototype.hasOwnProperty.call(groupedByModel, modelId) && groupedByModel[modelId].length > 0) {
      const modelHistoryItems: HistoryItem[] = groupedByModel[modelId]; // Get all history items for this model
      const modelMainStats = calculateAggregatedStatsForGroup(modelHistoryItems); // Calculate main stats for this model
      const modelName = allModels[modelId]?.name || modelId; // Get friendly model name or use ID
      // Get detailed stats for commands used *with* this model's history items using the helper
      const commandSubGroupItems = getDetailedSubGroupStats(modelHistoryItems, "actionName");
      statsByModelDetailed.push({
        modelId,
        modelName,
        mainStats: modelMainStats,
        commandSubGroupItems,
      });
    }
  }
  // Sort models by overall usage count descending for display
  statsByModelDetailed.sort((a, b) => b.mainStats.count - a.mainStats.count);

  // --- Construct categories array for the List view ---
  // Each object in this array represents a list item/category in the stats view.
  const categories = [
    // Overall stats - Include breakdown by Commands and Models
    {
      id: "total",
      title: "Overall statistics",
      markdownStats: formatDetailedStatsMarkdown(
        "Overall statistics",
        totalStats,
        "Commands Executed:",
        totalCommands,
        "Models Used:",
        totalModels,
      ),
    },
    {
      id: "period-hour",
      title: "Last 1 hour",
      markdownStats: formatDetailedStatsMarkdown(
        "Last 1 hour",
        hourStats,
        "Commands Executed:",
        hourCommands,
        "Models Used:",
        hourModels,
      ),
    },
    {
      id: "period-last24hours",
      title: "Last 24 hours",
      markdownStats: formatDetailedStatsMarkdown(
        "Last 24 hours",
        last24HoursStats,
        "Commands Executed:",
        last24HoursCommands,
        "Models Used:",
        last24HoursModels,
      ),
    },
    {
      id: "period-today",
      title: "For today (since midnight)",
      markdownStats: formatDetailedStatsMarkdown(
        "For today (since midnight)",
        todayStats,
        "Commands Executed:",
        todayCommands,
        "Models Used:",
        todayModels,
      ),
    },
    {
      id: "period-yesterday",
      title: "Yesterday (midnight to midnight)",
      markdownStats: formatDetailedStatsMarkdown(
        "Yesterday (midnight to midnight)",
        yesterdayStats,
        "Commands Executed:",
        yesterdayCommands,
        "Models Used:",
        yesterdayModels,
      ),
    },
    {
      id: "period-last7days",
      title: "Last 7 days",
      markdownStats: formatDetailedStatsMarkdown(
        "Last 7 days",
        last7DaysStats,
        "Commands Executed:",
        last7DaysCommands,
        "Models Used:",
        last7DaysModels,
      ),
    },
    {
      id: "period-week",
      title: "This week (since Monday)",
      markdownStats: formatDetailedStatsMarkdown(
        "This week (since Monday)",
        thisWeekStats,
        "Commands Executed:",
        thisWeekCommands,
        "Models Used:",
        thisWeekModels,
      ),
    },
    {
      id: "period-last30days",
      title: "Last 30 days",
      markdownStats: formatDetailedStatsMarkdown(
        "Last 30 days",
        last30DaysStats,
        "Commands Executed:",
        last30DaysCommands,
        "Models Used:",
        last30DaysModels,
      ),
    },
    {
      id: "period-month",
      title: "This month (since 1st)",
      markdownStats: formatDetailedStatsMarkdown(
        "This month (since 1st)",
        thisMonthStats,
        "Commands Executed:",
        thisMonthCommands,
        "Models Used:",
        thisMonthModels,
      ),
    },

    // Stats grouped by Command - Include detailed breakdown by Models used within each command
    ...statsByActionNameDetailed.map((item) => ({
      // Use a sanitized ID for the key to avoid issues with special characters in actionName
      id: `command-${item.actionName.replace(/[^a-zA-Z0-9-_]/g, "_")}`,
      title: `Command: "${getCmd(item.actionName).name}"`, // Display friendly command name in list title
      markdownStats: formatDetailedStatsMarkdown(
        `Statistics for Command: ${getCmd(item.actionName).name}`, // Use friendly name in markdown title
        item.mainStats, // Main stats for this command
        "Models Used:", // Title for the sub-group list
        item.modelSubGroupItems, // Pass detailed model sub-group stats for this command
      ),
    })),

    // Stats grouped by Model - Include detailed breakdown by Commands used with each model
    ...statsByModelDetailed.map((item) => ({
      // Use a sanitized ID for the key
      id: `model-${item.modelId.replace(/[^a-zA-Z0-9-_]/g, "_")}`,
      title: `Model: "${item.modelName}"`, // Display friendly model name in list title
      markdownStats: formatDetailedStatsMarkdown(
        `Statistics for Model: ${item.modelName}`, // Use friendly name in markdown title
        item.mainStats, // Main stats for this model
        "Commands Executed:", // Title for the sub-group list
        item.commandSubGroupItems, // Pass detailed command sub-group stats for this model
      ),
    })),
  ];

  // Render the List view
  return (
    <List isShowingDetail={true} isLoading={isLoading} searchBarPlaceholder="Search by statistics categories">
      {/* Map through the categories array to create List.Items */}
      {categories.map((category) => (
        <List.Item
          key={category.id} // Unique key for each list item
          title={category.title} // Title displayed in the list
          detail={<List.Item.Detail markdown={category.markdownStats} />} // Markdown content for the detail pane
          actions={
            <ActionPanel>
              {/* Action to copy the markdown content */}
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

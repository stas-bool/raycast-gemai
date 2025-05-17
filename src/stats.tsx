import { Action, ActionPanel, List } from "@raycast/api";
import { getCmd } from "./core/commands";
import { useCommandHistory } from "./core/history";
import {
  calculateAggregatedStatsForGroup,
  groupHistoryByKey,
  GroupStats,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from "./core/utils";

function formatStatsMarkdown(title: string, stats: GroupStats): string {
  if (stats.count === 0) {
    return `### ${title}\n\nNo data for this period or category.`;
  }

  return (
    `### ${title}\n\n` +
    `* **Number of requests:** ${stats.count}\n` +
    `* **Total cost:** $${stats.totalCost.toFixed(4)}\n` +
    `* **Total tokens:** ${stats.totalTokens.toLocaleString()}\n` +
    `* **Average tokens per request:** ${parseInt(stats.avgTotalTokens.toFixed(0)).toLocaleString()}\n` +
    `* **Response time:** ~${stats.avgTotalTime.toFixed(2)} sec`
  );
}

export default function StatsCommand() {
  const { history, isLoading } = useCommandHistory();

  const totalStats = calculateAggregatedStatsForGroup(history);

  const today = startOfToday();
  const yesterday = startOfYesterday();
  const thisWeek = startOfWeek();
  const thisMonth = startOfMonth();

  const todayHistory = history.filter((item) => new Date(item.timestamp) >= today);
  const yesterdayHistory = history.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= yesterday && itemDate < today;
  });
  const thisWeekHistory = history.filter((item) => new Date(item.timestamp) >= thisWeek);
  const thisMonthHistory = history.filter((item) => new Date(item.timestamp) >= thisMonth);

  const todayStats = calculateAggregatedStatsForGroup(todayHistory);
  const yesterdayStats = calculateAggregatedStatsForGroup(yesterdayHistory);
  const thisWeekStats = calculateAggregatedStatsForGroup(thisWeekHistory);
  const thisMonthStats = calculateAggregatedStatsForGroup(thisMonthHistory);

  const statsByActionName: { actionName: string; stats: GroupStats }[] = [];
  const groupedByAction = groupHistoryByKey(history, "actionName");

  for (const actionName in groupedByAction) {
    if (groupedByAction[actionName].length > 0) {
      statsByActionName.push({
        actionName,
        stats: calculateAggregatedStatsForGroup(groupedByAction[actionName]),
      });
    }
  }

  statsByActionName.sort((a, b) => b.stats.count - a.stats.count);

  const categories = [
    { id: "total", title: "Overall statistics", markdownStats: formatStatsMarkdown("Overall statistics", totalStats) },
    { id: "period-today", title: "For today", markdownStats: formatStatsMarkdown("For today", todayStats) },
    { id: "period-yesterday", title: "Yesterday", markdownStats: formatStatsMarkdown("For yesterday", yesterdayStats) },
    { id: "period-week", title: "This week", markdownStats: formatStatsMarkdown("For this week", thisWeekStats) },
    { id: "period-month", title: "This month", markdownStats: formatStatsMarkdown("For this month", thisMonthStats) },
    ...statsByActionName.map((item) => ({
      id: `command-${item.actionName}`, // Unique ID for each command
      title: `Only "${getCmd(item.actionName).name}"`,
      markdownStats: formatStatsMarkdown(`Statistics for command: "${item.actionName}"`, item.stats),
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
                content={category.markdownStats}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

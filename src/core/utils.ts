import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { allModels } from "./models";
import { HistoryItem, RequestStats } from "./types";

export function getSystemPrompt(promptPath: string | undefined, defaultPrompt?: string): string {
  let resolvedPath = promptPath ? promptPath.trim() : "";

  if (resolvedPath.startsWith("~")) {
    resolvedPath = path.join(os.homedir(), resolvedPath.slice(1));
  }

  let finalPrompt = "";

  if (resolvedPath && fs.existsSync(resolvedPath)) {
    finalPrompt = fs.readFileSync(resolvedPath, "utf8");
    finalPrompt = finalPrompt.replace(/^---[\s\S]*?---\s*/, "");
    finalPrompt = finalPrompt.trim() + "\n";
  } else if (defaultPrompt) {
    finalPrompt = defaultPrompt.trim() + "\n";
  }

  return finalPrompt;
}

export function formatDate(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}, ${month} ${day}`;
}

export function renderStats(modelNameUser: string, temperature: number, stats: RequestStats): string {
  const timeStr =
    Math.abs(stats.totalTime - stats.firstRespTime) < 0.1
      ? `Time: ${stats.firstRespTime.toFixed(1)} sec`
      : `Time: ${stats.firstRespTime.toFixed(1)}+${(stats.totalTime - stats.firstRespTime).toFixed(1)} sec`;

  return (
    `${modelNameUser}; ${temperature}°; ${timeStr}; ` +
    `P:${stats.prompt} + I:${stats.input} + T:${stats.thoughts} ~ ${stats.total} tokens.`
  );
}

export function dump(variable: unknown, label?: string): void {
  if (label) {
    console.debug(label + ":", JSON.stringify(variable, null, 2));
  } else {
    console.debug(JSON.stringify(variable, null, 2));
  }
}

export function dumpLog(variable: unknown, label?: string): void {
  if (label) {
    console.debug(label + ":", variable);
  } else {
    console.debug(variable);
  }
}

export function toMdJson(variable: unknown): string {
  return ["```json", JSON.stringify(variable, null, 2), "```"].join("\n");
}

export function calculateItemCost(item: HistoryItem): number {
  const modelName = item.model ?? "gemini-2.5-flash-preview-04-17";
  return calculatePricePerMillionTokens(modelName, item.requestStats);
}

export interface GroupStats {
  count: number;
  totalCost: number;
  totalTokens: number;
  avgTotalTokens: number;
  totalTimeSum: number;
  avgTotalTime: number;
}

export function calculateAggregatedStatsForGroup(group: HistoryItem[]): GroupStats {
  if (group.length === 0) {
    return { count: 0, totalCost: 0, totalTokens: 0, avgTotalTokens: 0, totalTimeSum: 0, avgTotalTime: 0 };
  }

  let totalCost = 0;
  let totalTokensSum = 0;
  let totalTimeSum = 0;
  let validStatsCount = 0;

  for (const item of group) {
    totalCost += calculateItemCost(item);

    if (item.requestStats && item.requestStats.total !== undefined && item.requestStats.totalTime !== undefined) {
      totalTokensSum += item.requestStats.total;
      totalTimeSum += item.requestStats.totalTime;
      validStatsCount++;
    } else {
      // console.warn("[calculateAggregatedStatsForGroup] Skipping item due to missing requestStats or total/totalTime", item);
    }
  }

  const avgTotalTokens = validStatsCount > 0 ? totalTokensSum / validStatsCount : 0;
  const avgTotalTime = validStatsCount > 0 ? totalTimeSum / validStatsCount : 0;

  return {
    count: group.length,
    totalCost: totalCost,
    totalTokens: totalTokensSum,
    avgTotalTokens: avgTotalTokens,
    totalTimeSum: totalTimeSum,
    avgTotalTime: avgTotalTime,
  };
}

export function groupHistoryByKey<K extends keyof HistoryItem>(
  history: HistoryItem[],
  key: K,
): Record<string, HistoryItem[]> {
  return history.reduce(
    (acc, item) => {
      const groupValue = String(item[key] ?? "undefined_key");
      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }
      acc[groupValue].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function startOfYesterday(): Date {
  const today = startOfToday();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}

// ISO 8601 week date
export function startOfWeek(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, ... 6 for Saturday
  // Adjust date to Monday of the current week
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const start = new Date(now.getFullYear(), now.getMonth(), diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getPeriodKey(timestamp: number, period: "hour" | "day" | "week" | "month" | "year"): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate(); // 1-31
  const hour = date.getHours(); // 0-23

  switch (period) {
    case "hour":
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} H${String(hour).padStart(2, "0")}`;
    case "day":
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    case "week":
      // ISO 8601 week calculation
      const d = new Date(Date.UTC(year, date.getMonth(), day));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
      return `${d.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
    case "month":
      return `${year}-${String(month).padStart(2, "0")}`;
    case "year":
      return String(year);
    default:
      const exhaustiveCheck: never = period;
      throw new Error(`Unknown period: ${exhaustiveCheck}`);
  }
}

export function calculatePricePerMillionTokens(modelKey: string, stats: RequestStats): number {
  const model = allModels[modelKey];
  if (!model) throw new Error(`Unknown model: ${modelKey}`);

  const input_tokens = (stats?.prompt ?? 0) + (stats?.input ?? 0);
  const output_tokens = (stats?.thoughts ?? 0) + ((stats?.total ?? 0) - input_tokens);

  const input_price = (input_tokens / 1_000_000) * model.price_input;

  let output_price = 0;
  if ((stats?.thoughts ?? 0) > 0 && model.price_output_thinking > 0) {
    output_price = (output_tokens / 1_000_000) * model.price_output_thinking;
  } else {
    output_price = (output_tokens / 1_000_000) * model.price_output;
  }

  return input_price + output_price;
}

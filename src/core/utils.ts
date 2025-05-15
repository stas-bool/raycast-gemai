import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { RequestStats } from "./types";

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

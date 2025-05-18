import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useEffect, useState } from "react";
import { HistoryItem } from "./types";

const storageKeyName = "gemai_history";

export async function loadHistoryFromStorage(): Promise<HistoryItem[]> {
  try {
    const storedHistory = await LocalStorage.getItem(storageKeyName);

    if (storedHistory) {
      const parsed = JSON.parse("" + storedHistory);
      return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
    }

    return [];
  } catch (error) {
    showFailureToast(error);
    console.error("Failed to load command history:", error);
    return [];
  }
}

export async function renderHistoryStats(): Promise<string> {
  const history = await loadHistoryFromStorage();

  const now = Date.now();
  const MS_PER_HOUR = 60 * 60 * 1000;
  const MS_PER_DAY = 24 * MS_PER_HOUR;
  const MS_PER_WEEK = 7 * MS_PER_DAY;
  const MS_PER_MONTH = 30 * MS_PER_DAY;

  let hour = 0,
    day = 0,
    week = 0,
    month = 0;

  for (const item of history) {
    const diff = now - item.timestamp;
    if (diff <= MS_PER_HOUR) hour++;
    if (diff <= MS_PER_DAY) day++;
    if (diff <= MS_PER_WEEK) week++;
    if (diff <= MS_PER_MONTH) month++;
  }

  return `History: ${hour}/h, ${day}/today, ${week}/week, ${month}/month. Total ${history.length}.`;
}

export function useCommandHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const addToHistory = async (historyItem: HistoryItem) => {
    try {
      let currentHistory = await loadHistoryFromStorage();

      const isDuplicate = currentHistory.some(
        (entry: HistoryItem) => entry.query === historyItem.query && Date.now() - entry.timestamp <= 1000,
      );

      if (isDuplicate) {
        return;
      }

      const updatedHistory = [historyItem, ...currentHistory];
      await LocalStorage.setItem(storageKeyName, JSON.stringify(updatedHistory));

      setHistory(updatedHistory);
    } catch (error) {
      showFailureToast(error);
      console.error("Failed to add to command history:", error);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    const loaded = await loadHistoryFromStorage();
    setHistory(loaded);
    setIsLoading(false);
  };

  const removeFromHistory = async (timestamp: number) => {
    try {
      let currentHistory = await loadHistoryFromStorage();
      const updatedHistory = currentHistory.filter((item: HistoryItem) => item.timestamp !== timestamp);
      await LocalStorage.setItem(storageKeyName, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      showFailureToast(error);
      console.error("Failed to remove history item:", error);
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      await LocalStorage.removeItem(storageKeyName);
    } catch (error) {
      showFailureToast(error);
      console.error("Failed to clear command history:", error);
    }
  };

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    getHistoryStats: renderHistoryStats,
    clearHistory,
    loadHistory,
  };
}

import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useEffect, useState } from "react";
import { HistoryItem, HistoryStats } from "./types";

var storageKeyName = "gemai_history";

// Общая функция для загрузки истории с приведением к типу HistoryItem[]
export async function loadHistoryFromStorage(): Promise<HistoryItem[]> {
  try {
    const storedHistory = await LocalStorage.getItem(storageKeyName);
    if (storedHistory) {
      // Приводим к типу HistoryItem[]
      const parsed = JSON.parse("" + storedHistory);
      // Можно добавить дополнительную проверку структуры, если нужно
      return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
    }
    return [];
  } catch (error) {
    showFailureToast(error);
    console.error("Failed to load command history:", error);
    return [];
  }
}

export async function getHistoryStats(): Promise<HistoryStats> {
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

  return {
    hour,
    day,
    week,
    month,
    total: history.length,
  };
}

// Основной хук
export function useCommandHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const addToHistory = async (historyItem: HistoryItem) => {
    try {
      let currentHistory = await loadHistoryFromStorage();

      // Only consider entries from the last 5 minutes as potential duplicates
      const second = new Date(Date.now() - 1000).toISOString();
      const isDuplicate = currentHistory.some(
        (entry: HistoryItem) => entry.query === historyItem.query && entry.date > second,
      );

      if (isDuplicate) {
        return;
      }

      // Update with new entry
      const updatedHistory = [historyItem, ...currentHistory];

      // Store in LocalStorage first to ensure persistence
      await LocalStorage.setItem(storageKeyName, JSON.stringify(updatedHistory));

      // Then update state to reflect changes
      setHistory(updatedHistory);
    } catch (error) {
      showFailureToast(error);
      console.error("Failed to add to command history:", error);
    }
  };

  /**
   * Load command history from LocalStorage
   */
  const loadHistory = async () => {
    setIsLoading(true);
    const loaded = await loadHistoryFromStorage();
    setHistory(loaded);
    setIsLoading(false);
  };

  /**
   * Clear all command history
   */
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
    getHistoryStats,
    clearHistory,
    loadHistory,
  };
}

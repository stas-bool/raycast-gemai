import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useEffect, useState } from "react";
import { HistoryItem } from "./types";

export function useCommandHistory() {
  const storageKeyName = "gemai_history";

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const addToHistory = async (historyItem: HistoryItem) => {
    try {
      const storedHistory = await LocalStorage.getItem(storageKeyName);
      let currentHistory = storedHistory ? JSON.parse("" + storedHistory) : [];

      // Only consider entries from the last 5 minutes as potential duplicates
      const second = new Date(Date.now() - 1000).toISOString();
      const isDuplicate = currentHistory.some(
        (entry: HistoryItem) => entry.query === historyItem.query && entry.timestamp > second,
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
    try {
      setIsLoading(true);
      const storedHistory = await LocalStorage.getItem(storageKeyName);
      if (storedHistory) {
        setHistory(JSON.parse("" + storedHistory));
      }
      setIsLoading(false);
    } catch (error) {
      showFailureToast(error);
      console.error("Failed to load command history:", error);
      setIsLoading(false);
    }
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
    clearHistory,
    loadHistory,
  };
}

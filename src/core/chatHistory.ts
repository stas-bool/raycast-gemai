import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useEffect, useState } from "react";
import { ChatMessage } from "./types";


const STORAGE_KEY = "gemai_chat_messages";
const HISTORY_SETTINGS_KEY = "gemai_chat_history_settings";

interface ChatHistorySettings {
  historyMessagesCount: number;
}

export async function loadChatMessagesFromStorage(): Promise<ChatMessage[]> {
  try {
    const storedMessages = await LocalStorage.getItem(STORAGE_KEY);
    if (storedMessages) {
      const parsed = JSON.parse("" + storedMessages);
      return Array.isArray(parsed) ? (parsed as ChatMessage[]) : [];
    }
    return [];
  } catch (error) {
    showFailureToast(error);
    return [];
  }
}

export async function saveChatMessagesToStorage(messages: ChatMessage[]): Promise<void> {
  try {
    await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    showFailureToast(error);
  }
}

export async function loadChatHistorySettings(): Promise<ChatHistorySettings> {
  try {
    const storedSettings = await LocalStorage.getItem(HISTORY_SETTINGS_KEY);
    if (storedSettings) {
      const parsed = JSON.parse("" + storedSettings);
      return {
        historyMessagesCount: parsed.historyMessagesCount || 10,
      };
    }
    return { historyMessagesCount: 10 };
  } catch (error) {
    showFailureToast(error);
    return { historyMessagesCount: 10 };
  }
}

export async function saveChatHistorySettings(settings: ChatHistorySettings): Promise<void> {
  try {
    await LocalStorage.setItem(HISTORY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    showFailureToast(error);
  }
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historySettings, setHistorySettings] = useState<ChatHistorySettings>({ historyMessagesCount: 10 });

  useEffect(() => {
    loadMessages();
    loadSettings();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    const loadedMessages = await loadChatMessagesFromStorage();
    setMessages(loadedMessages);
    setIsLoading(false);
  };

  const loadSettings = async () => {
    const settings = await loadChatHistorySettings();
    setHistorySettings(settings);
  };

  const addMessage = async (message: ChatMessage) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, message];
      saveChatMessagesToStorage(updatedMessages);
      return updatedMessages;
    });
  };

  const updateMessage = async (
    messageId: string,
    content: string,
    isStreaming = false,
    requestStats?: any
  ) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map((msg) => {
        if (msg.id === messageId) {
          // Всегда обновляем requestStats если они переданы
          return {
            ...msg,
            content,
            isStreaming,
            ...(requestStats !== undefined ? { requestStats } : {}),
          };
        }
        return msg;
      });
      if (!isStreaming) {
        saveChatMessagesToStorage(updatedMessages);
      }
      return updatedMessages;
    });
  };

  const clearMessages = async () => {
    setMessages([]);
    await LocalStorage.removeItem(STORAGE_KEY);
  };

  const updateHistorySettings = async (settings: Partial<ChatHistorySettings>) => {
    const newSettings = { ...historySettings, ...settings };
    setHistorySettings(newSettings);
    await saveChatHistorySettings(newSettings);
  };

  return {
    messages,
    isLoading,
    historySettings,
    addMessage,
    updateMessage,
    clearMessages,
    loadMessages,
    updateHistorySettings,
  };
}

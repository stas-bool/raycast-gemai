import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useEffect, useState } from "react";
import { ChatMessage } from "./types";


const STORAGE_KEY = "gemai_chat_messages";

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

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    const loadedMessages = await loadChatMessagesFromStorage();
    setMessages(loadedMessages);
    setIsLoading(false);
  };

  const addMessage = async (message: ChatMessage) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, message];
      saveChatMessagesToStorage(updatedMessages);
      return updatedMessages;
    });
  };

  const updateMessage = async (messageId: string, content: string, isStreaming = false) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, content, isStreaming } : msg
      );
      
      // Only save to storage when streaming is done to improve performance
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

  return {
    messages,
    isLoading,
    addMessage,
    updateMessage,
    clearMessages,
    loadMessages,
  };
}

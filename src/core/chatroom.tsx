import {
  Action,
  ActionPanel,
  Icon,
  Keyboard,
  List,
  showToast,
  Toast,
  Color,
  confirmAlert,
} from "@raycast/api";
import React, { useState, useEffect } from "react";
import { createAIProvider } from "./aiProvider";
import { useChatMessages } from "./chatHistory";
import { AIConfig, ChatMessage, RequestStats } from "./types";
import { calculateItemCost } from "./utils";

interface ChatRoomProps {
  aiConfig: AIConfig;
}

export default function ChatRoom({ aiConfig }: ChatRoomProps) {
  const { messages, isLoading, addMessage, updateMessage, clearMessages } = useChatMessages();
  const [isGenerating, setIsGenerating] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Sync local messages with global messages
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Group messages into conversation pairs
  const getConversationPairs = () => {
    const pairs: { user: ChatMessage; assistant?: ChatMessage }[] = [];
    let currentPair: { user?: ChatMessage; assistant?: ChatMessage } = {};

    localMessages.forEach((message) => {
      if (message.role === "user") {
        if (currentPair.user) {
          pairs.push({ user: currentPair.user, assistant: currentPair.assistant });
        }
        currentPair = { user: message };
      } else if (message.role === "assistant" && currentPair.user) {
        currentPair.assistant = message;
        pairs.push({ user: currentPair.user, assistant: currentPair.assistant });
        currentPair = {};
      }
    });

    // Add any remaining unpaired user message
    if (currentPair.user) {
      pairs.push({ user: currentPair.user });
    }

    return pairs.reverse(); // Reverse to show newest first
  };

  const sendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      timestamp: Date.now(),
      role: "user",
      content: messageText,
    };

    await addMessage(userMessage);
    
    // Select the user message first
    setSelectedMessageId(userMessage.id);

    // Small delay to ensure user message is added before assistant placeholder
    // TODO: Consider removing this delay if state updates work correctly
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create assistant message placeholder
    const assistantMessageId = `msg_${Date.now()}_assistant`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      timestamp: Date.now(),
      role: "assistant",
      content: "", // Will be updated as chunks arrive
      model: aiConfig.model.modelName,
      isStreaming: true,
    };

    await addMessage(assistantMessage);
    setIsGenerating(true);

    try {
      await showToast({
        style: Toast.Style.Animated,
        title: `${aiConfig.model.modelNameUser} is thinking...`,
      });

      const provider = createAIProvider(aiConfig);

      // Get last messages for context (excluding the assistant placeholder we just added)
      // We need to manually add the user message since state might not be updated yet
      const currentMessages = [...messages, userMessage];
      const contextMessages = currentMessages.slice(-10).filter(msg => msg.id !== assistantMessageId);
      
      // Build conversation context
      let conversationContext = "";
      if (contextMessages.length > 0) {
        conversationContext = contextMessages
          .map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
          .join("\n\n");
        conversationContext += `\n\nHuman: ${messageText}`;
      } else {
        conversationContext = messageText;
      }

      const startTime = Date.now();
      const response = provider.sendRequest(aiConfig, conversationContext, undefined);

      let responseText = "";
      let usageMetadata: any = undefined;
      let firstRespTime: number | null = null;
      let chunkCount = 0;

      for await (const chunk of response) {
        if (firstRespTime === null && chunk.text) {
          firstRespTime = (Date.now() - startTime) / 1000;
        }

        if (chunk.text) {
          responseText += chunk.text;
          chunkCount++;
          
          // Update UI every 3 chunks or if we got significant content to avoid too frequent updates
          if (chunkCount % 3 === 0 || responseText.length > chunkCount * 10) {
            updateMessage(assistantMessageId, responseText, true);
          }
        }

        if (chunk.usageMetadata) {
          usageMetadata = chunk.usageMetadata;
        }
      }
      
      // Make sure we show the final content
      if (responseText) {
        updateMessage(assistantMessageId, responseText, true);
      }

      // Finalize the message with stats
      const requestStats: RequestStats = await provider.getTokenStats(aiConfig, usageMetadata, conversationContext, undefined);
      requestStats.firstRespTime = firstRespTime || 0;
      requestStats.totalTime = (Date.now() - startTime) / 1000;

      // Update the assistant message with final content and stats
      await updateMessage(assistantMessageId, responseText, false);
      
      // Auto-select the conversation pair (using assistant message ID)
      setSelectedMessageId(assistantMessageId);

      const cost = calculateItemCost({
        model: aiConfig.model.modelName,
        requestStats: requestStats,
        timestamp: Date.now(),
        actionName: "chat",
        query: messageText,
        response: responseText,
        isAttachmentFile: false,
      });

      await showToast({
        style: Toast.Style.Success,
        title: "Response received",
        message: `${requestStats.totalTime.toFixed(1)}s, $${cost.toFixed(4)}`,
      });
    } catch (error: any) {
      await updateMessage(assistantMessageId, `Error: ${error.message}`, false);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to get response",
        message: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getMessageAccessories = (message: ChatMessage) => {
    const accessories = [];

    if (message.isStreaming) {
      accessories.push({
        icon: Icon.CircleProgress,
        tooltip: "Generating...",
      });
    }

    if (message.requestStats && message.role === "assistant") {
      const cost = calculateItemCost({
        model: message.model || "unknown",
        requestStats: message.requestStats,
        timestamp: message.timestamp,
        actionName: "chat",
        query: "",
        response: message.content,
        isAttachmentFile: false,
      });

      // Add model name
      accessories.push({
        tag: {
          value: aiConfig.model.modelNameUser || message.model || "AI",
          color: Color.Blue,
        },
        tooltip: `Model: ${aiConfig.model.modelNameUser || message.model}`,
      });

      accessories.push({
        tag: {
          value: `$${cost.toFixed(4)}`,
          color: Color.SecondaryText,
        },
        tooltip: `Cost: $${cost.toFixed(4)}, Tokens: ${message.requestStats.total}`,
      });
    }

    return accessories;
  };

  const formatMessageTitle = (message: ChatMessage) => {
    const time = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const role = message.role === "user" ? "👤" : "🤖";
    return `${role} ${time}`;
  };

  if (isLoading) {
    return <List isLoading={true} />;
  }

  return (
    <List
      isShowingDetail
      searchBarPlaceholder="Type your message and press Enter..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      selectedItemId={selectedMessageId || undefined}
      onSelectionChange={(id) => {
        if (id) {
          setSelectedMessageId(id);
        }
      }}
      navigationTitle={`Chat with AI (${aiConfig.request.primaryLanguage})`}
      actions={
        !isGenerating ? (
          <ActionPanel>
            <Action
              title="Send Message"
              icon={Icon.Message}
              onAction={async () => {
                if (searchText.trim()) {
                  await sendMessage(searchText.trim());
                  setSearchText("");
                }
              }}
            />
            <ActionPanel.Section title="Chat Management">
              <Action
                title="Clear Chat History"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
                onAction={async () => {
                  if (await confirmAlert({ title: "Clear all chat messages?" })) {
                    await clearMessages();
                    setLocalMessages([]);
                  }
                }}
              />
            </ActionPanel.Section>
          </ActionPanel>
        ) : undefined
      }
    >
      {localMessages.length === 0 ? (
        <List.EmptyView
          icon={Icon.Message}
          title="Start a conversation"
          description="Type your message above and press Enter"
          actions={
            <ActionPanel>
              <Action
                title="Send Message"
                icon={Icon.Message}
                onAction={async () => {
                  if (searchText.trim()) {
                    await sendMessage(searchText.trim());
                    setSearchText("");
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ) : (
        getConversationPairs().map((pair, index) => {
          const pairId = pair.assistant?.id || pair.user.id;
          const isGeneratingPair = pair.user && !pair.assistant && isGenerating;
          const time = new Date(pair.user.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const title = `💬 ${time}`;
          
          // Create combined markdown for detail view
          const assistantName = pair.assistant?.model 
            ? `🤖 ${aiConfig.model.modelNameUser || pair.assistant.model}`
            : `🤖 ${aiConfig.model.modelNameUser}`;
          
          const combinedMarkdown = `## 👤 You\n\n${pair.user.content}\n\n---\n\n## ${assistantName}\n\n${
            pair.assistant?.content || (isGeneratingPair ? "*Generating...*" : "*Waiting for response...*")
          }`;
          
          return (
            <List.Item
              id={pairId}
              key={pairId}
              title={title}
              subtitle={pair.user.content.substring(0, 50) + "..."}
              accessories={pair.assistant ? getMessageAccessories(pair.assistant) : []}
              detail={
                <List.Item.Detail 
                  markdown={combinedMarkdown} 
                />
              }
              actions={
                !isGenerating ? (
                  <ActionPanel>
                    <Action
                      title="Send Message"
                      icon={Icon.Message}
                      onAction={async () => {
                        if (searchText.trim()) {
                          await sendMessage(searchText.trim());
                          setSearchText("");
                        }
                      }}
                    />
                    {pair.assistant && (
                      <Action.CopyToClipboard
                        title="Copy Response"
                        content={pair.assistant.content}
                        shortcut={Keyboard.Shortcut.Common.Copy}
                      />
                    )}
                    <Action.CopyToClipboard
                      title="Copy Question"
                      content={pair.user.content}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                    />
                    <ActionPanel.Section title="Chat Management">
                      <Action
                        title="Clear Chat History"
                        icon={Icon.Trash}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
                        onAction={async () => {
                          if (await confirmAlert({ title: "Clear all chat messages?" })) {
                            await clearMessages();
                            setLocalMessages([]);
                          }
                        }}
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                ) : undefined
              }
            />
          );
        })
      )}
    </List>
  );
}

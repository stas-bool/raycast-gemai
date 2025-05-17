import { Content, GenerationConfig, GoogleGenerativeAI, SafetySetting } from "@google/genai";
import {
  Action,
  ActionPanel,
  confirmAlert,
  Form,
  getPreferenceValues,
  getSelectedText,
  Icon,
  List,
  LocalStorage,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_CHAT, getCmd } from "./core/commands";
import { allModels } from "./core/models";
import { GemAIConfig, RaycastProps } from "./core/types";
import { formatDate } from "./core/utils"; // Assuming these are useful

// --- Constants ---
const CHAT_STORAGE_KEY = "geminiAIChatSessions_v2"; // New key for new structure
const MAX_HISTORY_FOR_API = 50; // Max number of user/model turns to send to API to keep context reasonable

// --- Interfaces ---
interface ChatMessage {
  id: string; // Unique ID for this message part (prompt or answer segment)
  role: "user" | "model";
  text: string;
  timestamp: number;
  isLoading?: boolean; // True if this model message is currently streaming/generating
  error?: string; // Error message if generation failed for this model message
  modelIdUsed?: string; // Model that generated this response
  // For potential future use with history logging
  // requestStats?: RequestStats;
}

interface ActiveChatSession {
  id: string;
  name: string;
  creationDate: number;
  messages: ChatMessage[]; // Chronological order of messages
  modelId: string; // Default model for new messages in this chat
  systemInstruction?: string | null; // Per-chat system instruction from buildGemAIConfig
  // For UI, to show which message is currently being typed by user
  currentPromptText?: string;
}

interface ChatState {
  currentChatId: string | null;
  sessions: ActiveChatSession[];
  isLoadingHistory: boolean; // True when loading from LocalStorage
  isAISpeaking: boolean; // True if AI is currently generating a response
}

// --- Helper Functions ---
const generateId = () => crypto.randomUUID();

const getDefaultChatName = (existingSessions: ActiveChatSession[]): string => {
  const prefix = "Chat ";
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const name = `${prefix}${i}`;
    if (!existingSessions.some((s) => s.name === name)) {
      return name;
    }
    i++;
  }
};

export default function AIChatView(props: RaycastProps) {
  const { pop, push } = useNavigation();
  const [chatState, setChatState] = useState<ChatState>({
    currentChatId: null,
    sessions: [],
    isLoadingHistory: true,
    isAISpeaking: false,
  });
  const [searchText, setSearchText] = useState(""); // User's current input

  // GemAI configuration and API client
  const [gemAiConfig, setGemAiConfig] = useState<GemAIConfig | null>(null);
  const [geminiAIClient, setGeminiAIClient] = useState<GoogleGenerativeAI | null>(null);

  const preferences = getPreferenceValues<Preferences.AiChat>(); // For chat-specific preferences

  // Effect to load initial GemAIConfig for the chat command
  useEffect(() => {
    try {
      const config = buildGemAIConfig(CMD_CHAT, props);
      setGemAiConfig(config);
      if (config.model.geminiApiKey) {
        setGeminiAIClient(new GoogleGenerativeAI(config.model.geminiApiKey));
      } else {
        showToast(Toast.Style.Failure, "API Key Missing", "Please set your Gemini API key in preferences.");
      }
    } catch (error) {
      console.error("Failed to build GemAI config:", error);
      showToast(Toast.Style.Failure, "Configuration Error", (error as Error).message);
    }
  }, [props]);

  // Load chats from LocalStorage on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      setChatState((prev) => ({ ...prev, isLoadingHistory: true }));
      try {
        const storedSessions = await LocalStorage.getItem<string>(CHAT_STORAGE_KEY);
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions) as ActiveChatSession[];
          let currentChatIdToSet = parsedSessions.length > 0 ? parsedSessions[0].id : null;

          // Handle launch context for initial query
          const initialQueryFromLaunch = (props.launchContext?.initialQuery as string) || props.arguments?.initialQuery;

          if (initialQueryFromLaunch && gemAiConfig) {
            const newChatName = `Query: ${initialQueryFromLaunch.substring(0, 20)}...`;
            const newSession: ActiveChatSession = {
              id: generateId(),
              name: newChatName,
              creationDate: Date.now(),
              messages: [], // Initial message will be added by handleSendMessage
              modelId: gemAiConfig.model.modelName, // Use default model from config
              systemInstruction: gemAiConfig.model.systemPrompt,
            };
            parsedSessions.unshift(newSession); // Add to the beginning
            currentChatIdToSet = newSession.id;
            setSearchText(initialQueryFromLaunch); // Pre-fill search text to send message
            // Automatically send the initial query
            // This needs to be handled carefully due to async nature of state updates
            // For now, user needs to press Enter after it's pre-filled.
            // Or, trigger send message after state is set.
          }

          setChatState({
            sessions: parsedSessions,
            currentChatId: currentChatIdToSet,
            isLoadingHistory: false,
            isAISpeaking: false,
          });

          if (initialQueryFromLaunch && currentChatIdToSet) {
            // Defer sending message until state is updated
            setTimeout(() => {
              handleSendMessage(initialQueryFromLaunch, currentChatIdToSet);
            }, 0);
          }
        } else if (gemAiConfig) {
          // Create a default initial chat if none exist
          const defaultSession: ActiveChatSession = {
            id: generateId(),
            name: getDefaultChatName([]),
            creationDate: Date.now(),
            messages: [],
            modelId: gemAiConfig.model.modelName,
            systemInstruction: gemAiConfig.model.systemPrompt,
          };
          setChatState({
            sessions: [defaultSession],
            currentChatId: defaultSession.id,
            isLoadingHistory: false,
            isAISpeaking: false,
          });
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        showToast(Toast.Style.Failure, "Error Loading Chats", (error as Error).message);
        setChatState((prev) => ({ ...prev, isLoadingHistory: false }));
      }
    };
    if (gemAiConfig) {
      // Ensure config is loaded before trying to create default chats
      loadChatHistory();
    }
  }, [gemAiConfig, props.launchContext, props.arguments]);

  // Save chats to LocalStorage when they change
  useEffect(() => {
    if (!chatState.isLoadingHistory && chatState.sessions.length > 0) {
      // Avoid saving initial empty/loading state
      LocalStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState.sessions));
    } else if (!chatState.isLoadingHistory && chatState.sessions.length === 0) {
      LocalStorage.removeItem(CHAT_STORAGE_KEY); // Clear storage if all chats are deleted
    }
  }, [chatState.sessions, chatState.isLoadingHistory]);

  const currentSession = useMemo(() => {
    return chatState.sessions.find((s) => s.id === chatState.currentChatId);
  }, [chatState.sessions, chatState.currentChatId]);

  const handleSendMessage = useCallback(
    async (query: string, targetChatId?: string) => {
      if (!query.trim() || !geminiAIClient || !gemAiConfig) return;

      const activeChatId = targetChatId || chatState.currentChatId;
      if (!activeChatId) {
        showToast(Toast.Style.Failure, "No active chat selected.");
        return;
      }

      setChatState((prev) => ({ ...prev, isAISpeaking: true }));
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        text: query,
        timestamp: Date.now(),
      };

      // Add user message to the UI immediately
      setChatState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === activeChatId ? { ...s, messages: [...s.messages, userMessage] } : s,
        ),
      }));
      setSearchText(""); // Clear input field

      const modelResponsePlaceholderId = generateId();
      // Add a placeholder for AI's response
      setChatState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === activeChatId
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    id: modelResponsePlaceholderId,
                    role: "model",
                    text: "",
                    timestamp: Date.now(),
                    isLoading: true,
                    modelIdUsed: currentSession?.modelId || gemAiConfig.model.modelName,
                  },
                ],
              }
            : s,
        ),
      }));

      try {
        const sessionToUpdate = chatState.sessions.find((s) => s.id === activeChatId);
        if (!sessionToUpdate) throw new Error("Chat session not found for update.");

        const modelForChat = geminiAIClient.getGenerativeModel({
          model: sessionToUpdate.modelId || gemAiConfig.model.modelName,
          safetySettings: gemAiConfig.model.safetySettings as SafetySetting[],
          generationConfig: {
            maxOutputTokens: gemAiConfig.model.maxOutputTokens,
            temperature: gemAiConfig.model.temperature,
            topP: gemAiConfig.model.topP,
            topK: gemAiConfig.model.topK,
            // candidateCount: 1, // Default is 1
          } as GenerationConfig,
          systemInstruction: sessionToUpdate.systemInstruction || gemAiConfig.model.systemPrompt,
        });

        // Prepare history for the API
        const historyForAPI: Content[] = sessionToUpdate.messages
          .filter(
            (msg) =>
              msg.id !== modelResponsePlaceholderId &&
              (msg.role === "user" || (msg.role === "model" && msg.text.trim() !== "" && !msg.error)),
          ) // Exclude empty/error model messages
          .slice(-MAX_HISTORY_FOR_API * 2) // Take last N turns (user + model = 1 turn)
          .map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          }));

        const chat = modelForChat.startChat({ history: historyForAPI });
        const result = await chat.sendMessageStream(query);

        let fullResponseText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponseText += chunkText;
          setChatState((prev) => ({
            ...prev,
            sessions: prev.sessions.map((s) =>
              s.id === activeChatId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === modelResponsePlaceholderId ? { ...m, text: fullResponseText, isLoading: true } : m,
                    ),
                  }
                : s,
            ),
          }));
        }

        // Final update for the model's message
        setChatState((prev) => ({
          ...prev,
          isAISpeaking: false,
          sessions: prev.sessions.map((s) =>
            s.id === activeChatId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === modelResponsePlaceholderId
                      ? { ...m, text: fullResponseText, isLoading: false, timestamp: Date.now() }
                      : m,
                  ),
                }
              : s,
          ),
        }));
      } catch (error: any) {
        console.error("Gemini API error:", error);
        const errorMessage = error.message || "Failed to get response from AI.";
        showToast(Toast.Style.Failure, "AI Error", errorMessage);
        setChatState((prev) => ({
          ...prev,
          isAISpeaking: false,
          sessions: prev.sessions.map((s) =>
            s.id === activeChatId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === modelResponsePlaceholderId
                      ? { ...m, text: `Error: ${errorMessage}`, isLoading: false, error: errorMessage, role: "model" }
                      : m,
                  ),
                }
              : s,
          ),
        }));
      }
    },
    [geminiAIClient, gemAiConfig, chatState.currentChatId, chatState.sessions, currentSession],
  );

  const handleCreateNewChat = (name: string, modelId: string) => {
    if (!gemAiConfig) return;
    const newSession: ActiveChatSession = {
      id: generateId(),
      name: name || getDefaultChatName(chatState.sessions),
      creationDate: Date.now(),
      messages: [],
      modelId: modelId || gemAiConfig.model.modelName,
      systemInstruction: gemAiConfig.model.systemPrompt, // Use default system prompt
    };
    setChatState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions], // Add to the beginning
      currentChatId: newSession.id,
    }));
    pop(); // Close the CreateChatForm
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (chatState.sessions.length <= 1) {
      showToast(Toast.Style.Failure, "Cannot delete the last chat.");
      return;
    }
    const confirmed = await confirmAlert({
      title: "Delete Chat?",
      message: `Are you sure you want to delete the chat "${chatState.sessions.find((s) => s.id === chatIdToDelete)?.name}"? This action cannot be undone.`,
      icon: Icon.Trash,
      primaryAction: { title: "Delete", style: Action.Style.Destructive },
    });

    if (confirmed) {
      setChatState((prev) => {
        const newSessions = prev.sessions.filter((s) => s.id !== chatIdToDelete);
        let newCurrentChatId = prev.currentChatId;
        if (prev.currentChatId === chatIdToDelete) {
          newCurrentChatId = newSessions.length > 0 ? newSessions[0].id : null;
        }
        return { ...prev, sessions: newSessions, currentChatId: newCurrentChatId };
      });
      showToast(Toast.Style.Success, "Chat Deleted");
    }
  };

  const handleClearMessages = async (chatIdToClear: string) => {
    const session = chatState.sessions.find((s) => s.id === chatIdToClear);
    if (!session) return;

    const confirmed = await confirmAlert({
      title: "Clear Chat Messages?",
      message: `Are you sure you want to delete all messages in "${session.name}"? This action cannot be undone.`,
      icon: Icon.Eraser,
      primaryAction: { title: "Clear Messages", style: Action.Style.Destructive },
    });

    if (confirmed) {
      setChatState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => (s.id === chatIdToClear ? { ...s, messages: [] } : s)),
      }));
      showToast(Toast.Style.Success, "Messages Cleared");
    }
  };

  const handleSwitchChat = (chatId: string) => {
    setChatState((prev) => ({ ...prev, currentChatId: chatId }));
  };

  const handleAppendSelectedText = async () => {
    try {
      const selectedText = await getSelectedText();
      setSearchText((prev) => prev + selectedText);
    } catch (error) {
      showToast(Toast.Style.Failure, "Could not get selected text.", (error as Error).message);
    }
  };

  const handleRenameChat = (chatId: string, newName: string) => {
    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === chatId ? { ...s, name: newName.trim() || s.name } : s)),
    }));
    pop(); // Close rename form
  };

  const handleChangeChatModel = (chatId: string, newModelId: string) => {
    setChatState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === chatId ? { ...s, modelId: newModelId } : s)),
    }));
    pop(); // Close model change form
  };

  if (chatState.isLoadingHistory || !gemAiConfig) {
    return <List isLoading={true} />;
  }

  const CreateChatForm = () => (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Chat"
            onSubmit={(values: { chatName: string; modelId: string }) =>
              handleCreateNewChat(values.chatName, values.modelId)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="chatName" title="Chat Name" placeholder={getDefaultChatName(chatState.sessions)} />
      <Form.Dropdown id="modelId" title="Model" defaultValue={gemAiConfig.model.modelName}>
        {Object.entries(allModels).map(([id, modelInfo]) => (
          <Form.Dropdown.Item key={id} value={id} title={modelInfo.name} />
        ))}
      </Form.Dropdown>
      <Form.Description
        text={`New chat will use the default system prompt: "${gemAiConfig.model.systemPrompt ? gemAiConfig.model.systemPrompt.substring(0, 50) + "..." : "Default"}"`}
      />
    </Form>
  );

  const RenameChatForm = ({ session }: { session: ActiveChatSession }) => (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Rename Chat"
            onSubmit={(values: { newName: string }) => handleRenameChat(session.id, values.newName)}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="newName" title="New Chat Name" defaultValue={session.name} />
    </Form>
  );

  const ChangeModelForm = ({ session }: { session: ActiveChatSession }) => (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Change Model"
            onSubmit={(values: { modelId: string }) => handleChangeChatModel(session.id, values.modelId)}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="modelId" title="Select Model" defaultValue={session.modelId}>
        {Object.entries(allModels).map(([id, modelInfo]) => (
          <Form.Dropdown.Item key={id} value={id} title={modelInfo.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={chatState.isAISpeaking ? "AI is thinking..." : getCmd(CMD_CHAT).ui_placeholder}
      isLoading={chatState.isAISpeaking}
      isShowingDetail={currentSession && currentSession.messages.length > 0}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Chat"
          value={chatState.currentChatId || ""}
          onChange={(newValue) => handleSwitchChat(newValue)}
        >
          <List.Dropdown.Section title="Chats">
            {chatState.sessions.map((session) => (
              <List.Dropdown.Item key={session.id} title={session.name} value={session.id} icon={Icon.Bubble} />
            ))}
          </List.Dropdown.Section>
          <List.Dropdown.Section>
            <List.Dropdown.Item
              title="Create New Chat..."
              value="--create-new--" // Special value
              icon={Icon.PlusCircle}
              onAction={() => push(<CreateChatForm />)} // This won't work directly, handle in onChange
            />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
      actions={
        <ActionPanel>
          {searchText.trim() && !chatState.isAISpeaking && (
            <Action title="Send Message" icon={Icon.PaperPlane} onAction={() => handleSendMessage(searchText)} />
          )}
          <Action
            title="Create New Chat"
            icon={Icon.PlusCircle}
            onAction={() => push(<CreateChatForm />)}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
          />
          <Action.Paste content={searchText} />
          <Action
            title="Append Selected Text"
            icon={Icon.Clipboard}
            onAction={handleAppendSelectedText}
            shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
          />
          {currentSession && (
            <>
              <Action
                title="Rename Current Chat"
                icon={Icon.Pencil}
                onAction={() => push(<RenameChatForm session={currentSession} />)}
                shortcut={{ modifiers: ["cmd"], key: "e" }}
              />
              <Action
                title="Change Chat Model"
                icon={Icon.Box}
                onAction={() => push(<ChangeModelForm session={currentSession} />)}
                shortcut={{ modifiers: ["cmd", "shift"], key: "m" }}
              />
              <Action
                title="Clear Current Chat Messages"
                icon={Icon.Eraser}
                style={Action.Style.Destructive}
                onAction={() => handleClearMessages(currentSession.id)}
                shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
              />
              <Action
                title="Delete Current Chat"
                icon={Icon.Trash}
                style={Action.Style.Destructive}
                onAction={() => handleDeleteChat(currentSession.id)}
                shortcut={{ modifiers: ["cmd", "opt"], key: "backspace" }}
              />
            </>
          )}
        </ActionPanel>
      }
    >
      {currentSession ? (
        currentSession.messages.length === 0 ? (
          <List.EmptyView
            title="No messages yet"
            description="Type your first message to start the conversation."
            icon={Icon.Message}
          />
        ) : (
          currentSession.messages.map((msg, index) => (
            <List.Item
              key={msg.id}
              title={msg.role === "user" ? "You" : allModels[msg.modelIdUsed || currentSession.modelId]?.name || "AI"}
              subtitle={msg.role === "user" ? msg.text : msg.isLoading ? "Typing..." : msg.text}
              icon={msg.role === "user" ? Icon.Person : msg.error ? Icon.Warning : Icon.ComputerChip}
              accessories={[
                { text: formatDate(new Date(msg.timestamp)), tooltip: new Date(msg.timestamp).toLocaleString() },
              ]}
              detail={
                msg.role === "model" && !msg.isLoading ? (
                  <List.Item.Detail markdown={msg.error ? `**Error:**\n${msg.text}` : msg.text} />
                ) : undefined
              }
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy Text" content={msg.text} />
                  {msg.role === "model" && !msg.isLoading && !msg.error && (
                    <Action
                      title="Resend Prompt Above"
                      icon={Icon.Repeat}
                      onAction={() => {
                        const userPromptIndex = currentSession.messages
                          .slice(0, index)
                          .reverse()
                          .findIndex((m) => m.role === "user");
                        if (userPromptIndex !== -1) {
                          const actualIndex = index - 1 - userPromptIndex;
                          const userPromptMessage = currentSession.messages[actualIndex];
                          if (userPromptMessage) {
                            handleSendMessage(userPromptMessage.text);
                          }
                        }
                      }}
                    />
                  )}
                  <Action.Paste content={msg.text} />
                  <ActionPanel.Section>
                    <Action
                      title="Create New Chat"
                      icon={Icon.PlusCircle}
                      onAction={() => push(<CreateChatForm />)}
                      shortcut={{ modifiers: ["cmd"], key: "n" }}
                    />
                    {currentSession && (
                      <>
                        <Action
                          title="Rename Current Chat"
                          icon={Icon.Pencil}
                          onAction={() => push(<RenameChatForm session={currentSession} />)}
                          shortcut={{ modifiers: ["cmd"], key: "e" }}
                        />
                        <Action
                          title="Clear Current Chat Messages"
                          icon={Icon.Eraser}
                          style={Action.Style.Destructive}
                          onAction={() => handleClearMessages(currentSession.id)}
                          shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
                        />
                        <Action
                          title="Delete Current Chat"
                          icon={Icon.Trash}
                          style={Action.Style.Destructive}
                          onAction={() => handleDeleteChat(currentSession.id)}
                          shortcut={{ modifiers: ["cmd", "opt"], key: "backspace" }}
                        />
                      </>
                    )}
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))
        )
      ) : (
        <List.EmptyView
          title="No Chat Selected"
          description="Create a new chat or select an existing one."
          icon={Icon.ChatBubbles}
        />
      )}
    </List>
  );
}

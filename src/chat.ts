import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_CHAT, getCmd } from "./core/commands";
import ChatRoom from "./core/chatroom";
import { RaycastProps } from "./core/types";

export default function Chat(props: RaycastProps) {
  const aiConfig = buildAIConfig(getCmd(CMD_CHAT).id, props);

  // Add language preference to the prompt
  const primaryLanguage = aiConfig.request.primaryLanguage || "English";
  const languagePrompt =
    primaryLanguage.toLowerCase() !== "english" ? `IMPORTANT: Always respond in ${primaryLanguage} language. ` : "";

  const fallbackPrompt =
    "You are a helpful AI assistant engaging in a conversation. " +
    languagePrompt +
    "Provide clear, accurate, and helpful responses. " +
    "Maintain context from previous messages in the conversation. " +
    "Be concise but thorough, and ask clarifying questions when needed.";

  // Update the system prompt with language preference
  aiConfig.model.systemPrompt = fallbackPrompt;
  aiConfig.ui.placeholder = getCmd(CMD_CHAT).ui_placeholder || "Start chatting with AI...";
  aiConfig.ui.useSelected = false;
  aiConfig.ui.allowPaste = true;

  return ChatRoom({ aiConfig });
}

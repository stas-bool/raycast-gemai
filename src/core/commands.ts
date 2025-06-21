export const CMD_ASK = "ask";
export const CMD_CHAT = "chat";
export const CMD_EXPLAINER = "explainer";
export const CMD_FRIEND = "friend";
export const CMD_GRAMMAR = "grammar";
export const CMD_HISTORY = "history";
export const CMD_LONGER = "longer";
export const CMD_PROFESSIONAL = "professional";
export const CMD_PROMPT_BUILDER = "promptBuilder";
export const CMD_REPHRASER = "rephraser";
export const CMD_SCR_EXPLAIN = "screenshotToExplain";
export const CMD_SCR_MARKDOWN = "screenshotToMarkdown";
export const CMD_SCR_TRANSLATE = "screenshotToTranslate";
export const CMD_SHORTER = "shorter";
export const CMD_STATS = "stats";
export const CMD_SUMMATOR = "summator";
export const CMD_TRANSLATOR = "translator";
export const CMD_COUNT_TOKENS = "countTokens";

export interface GemAiCommand {
  id: string;
  name: string;
  description: string;
  ui_placeholder?: string;
}

const allCommands: Record<string, GemAiCommand> = {
  [CMD_ASK]: {
    id: CMD_ASK,
    name: "Ask AI",
    description: "Ask AI any question on any topic with expert-level responses.",
    ui_placeholder: "Ask me any question",
  },
  [CMD_CHAT]: {
    id: CMD_CHAT,
    name: "Chat Room",
    description: "Interactive chat with AI in a persistent conversation room with context memory.",
    ui_placeholder: "Start chatting with AI...",
  },
  [CMD_EXPLAINER]: {
    id: CMD_EXPLAINER,
    name: "Explain It",
    description: "Explain the meaning of words, sentences, or concepts clearly and concisely.",
    ui_placeholder: "Enter text to explain it",
  },
  [CMD_FRIEND]: {
    id: CMD_FRIEND,
    name: "Friend Text Maker",
    description: "Make text warmer, friendlier, and more approachable while preserving the core message.",
    ui_placeholder: "Enter text to make it warmer",
  },
  [CMD_GRAMMAR]: {
    id: CMD_GRAMMAR,
    name: "Fix Grammar",
    description: "Fix grammar, spelling, punctuation, and improve readability for native speakers.",
    ui_placeholder: "Enter text to correct grammar",
  },
  [CMD_HISTORY]: {
    id: CMD_HISTORY,
    name: "GemAI - History",
    description: "Show history of conversations with AI with search and management features.",
  },
  [CMD_LONGER]: {
    id: CMD_LONGER,
    name: "Longer Text Maker",
    description: "Expand text by adding substantial details and examples while preserving core meaning.",
    ui_placeholder: "Enter text to make it longer",
  },
  [CMD_PROFESSIONAL]: {
    id: CMD_PROFESSIONAL,
    name: "Professional Text Maker",
    description: "Make text formal and professional using business tone while preserving core message.",
    ui_placeholder: "Enter text to make it formal",
  },
  [CMD_PROMPT_BUILDER]: {
    id: CMD_PROMPT_BUILDER,
    name: "Prompt Builder",
    description: "Create or improve LLM prompts using prompt engineering best practices.",
    ui_placeholder: "Enter any idea for new prompt",
  },
  [CMD_REPHRASER]: {
    id: CMD_REPHRASER,
    name: "Rephrase It",
    description: "Rewrite text using different words and sentence structures while preserving meaning and style.",
    ui_placeholder: "Enter text to rephrase it",
  },
  [CMD_SCR_EXPLAIN]: {
    id: CMD_SCR_EXPLAIN,
    name: "Screenshot -> Explain",
    description: "Take a screenshot and analyze it, answering questions or describing the content.",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SCR_MARKDOWN]: {
    id: CMD_SCR_MARKDOWN,
    name: "Screenshot -> Markdown",
    description: "Take a screenshot and convert all visible text to GitHub Flavored Markdown format.",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SCR_TRANSLATE]: {
    id: CMD_SCR_TRANSLATE,
    name: "Screenshot -> Translate",
    description: "Take a screenshot and translate all visible text between your configured languages.",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SHORTER]: {
    id: CMD_SHORTER,
    name: "Shorter Text Maker",
    description: "Make text significantly shorter and more concise while preserving all key information.",
    ui_placeholder: "Enter text to make it shorter",
  },
  [CMD_STATS]: {
    id: CMD_STATS,
    name: "GemAI - Stats",
    description: "Show detailed usage statistics, costs, and insights across different time periods.",
  },
  [CMD_SUMMATOR]: {
    id: CMD_SUMMATOR,
    name: "Summarize It",
    description: "Summarize text concisely (3-15 sentences) conveying main ideas and key points.",
    ui_placeholder: "Enter text to summarize it",
  },
  [CMD_TRANSLATOR]: {
    id: CMD_TRANSLATOR,
    name: "Translator",
    description: "Translate text between your configured primary and secondary languages with natural phrasing.",
    ui_placeholder: "Enter text to translate.",
  },
  [CMD_COUNT_TOKENS]: {
    id: CMD_COUNT_TOKENS,
    name: "GemAI - Count Tokens",
    description: "Count tokens in selected text or files for cost estimation and optimization.",
  },
};

export function getCmd(commandId: string): GemAiCommand {
  const command = allCommands[commandId];
  if (!command) {
    return {
      id: "UNDEFINED_COMMAND",
      name: "UNDEFINED_COMMAND",
      description: "UNDEFINED_COMMAND",
      ui_placeholder: "UNDEFINED_COMMAND",
    };
    // throw new Error(`Unknown command: ${commandId}`);
  }

  return command;
}

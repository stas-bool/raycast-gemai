export const CMD_ASK = "ask";
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
    description: "Ask AI any question on any topic.",
    ui_placeholder: "Ask me any question",
  },
  [CMD_EXPLAINER]: {
    id: CMD_EXPLAINER,
    name: "Explain It",
    description: "Explain selected text.",
    ui_placeholder: "Enter text to explain it",
  },
  [CMD_FRIEND]: {
    id: CMD_FRIEND,
    name: "Friend Text Maker",
    description: "Make text warmer and friendly",
    ui_placeholder: "Enter text to make it warmer",
  },
  [CMD_GRAMMAR]: {
    id: CMD_GRAMMAR,
    name: "Fix Grammar",
    description: "Fix correct grammar, spelling, punctuation for selected text.",
    ui_placeholder: "Enter text to correcte grammar",
  },
  [CMD_HISTORY]: {
    id: CMD_HISTORY,
    name: "History - GemAI",
    description: "Show history of chating with AI.",
  },
  [CMD_LONGER]: {
    id: CMD_LONGER,
    name: "Longer Text Maker",
    description: "Make selected text significantly longer.",
    ui_placeholder: "Enter text to make it longer",
  },
  [CMD_PROFESSIONAL]: {
    id: CMD_PROFESSIONAL,
    name: "Professional Text Maker",
    description: "Make text formal and professional",
    ui_placeholder: "Enter text to make it formal",
  },
  [CMD_PROMPT_BUILDER]: {
    id: CMD_PROMPT_BUILDER,
    name: "Prompt Builder",
    description: "Create or improve your prompt",
    ui_placeholder: "Enter any idea for new prompt",
  },
  [CMD_REPHRASER]: {
    id: CMD_REPHRASER,
    name: "Rephrase It",
    description: "Rewrite the provided text using different phrasing while maintaining the original meaning.",
    ui_placeholder: "Enter text to rephrase it",
  },
  [CMD_SCR_EXPLAIN]: {
    id: CMD_SCR_EXPLAIN,
    name: "Screenshot -> Explain",
    description: "Take a screenshot and analyze it, and answer the user's question (if applicable).",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SCR_MARKDOWN]: {
    id: CMD_SCR_MARKDOWN,
    name: "Screenshot -> Markdown",
    description: "Take a screenshot and convert it to markdown.",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SCR_TRANSLATE]: {
    id: CMD_SCR_TRANSLATE,
    name: "Screenshot -> Translate",
    description: "Take a screenshot and translate it.",
    ui_placeholder: "Additional instructions if any",
  },
  [CMD_SHORTER]: {
    id: CMD_SHORTER,
    name: "Shorter Text Maker",
    description: "Make selected text significantly shorter and more concise.",
    ui_placeholder: "Enter text to make it shorter",
  },
  [CMD_STATS]: {
    id: CMD_STATS,
    name: "GemAI - Stats",
    description: "Show usage insides, stats and costs",
  },
  [CMD_SUMMATOR]: {
    id: CMD_SUMMATOR,
    name: "Summarize It",
    description: "Summary selected text.",
    ui_placeholder: "Enter text to summarize it",
  },
  [CMD_TRANSLATOR]: {
    id: CMD_TRANSLATOR,
    name: "Translator",
    description: "Translate selected text.",
    ui_placeholder: "Enter text to translate.",
  },
  [CMD_COUNT_TOKENS]: {
    id: CMD_COUNT_TOKENS,
    name: "Count Tokens",
    description: "Count the tokens in the selected text.",
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

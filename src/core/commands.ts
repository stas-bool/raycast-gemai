export const CMD_TRANSLATOR = "translator";
export const CMD_SUMMATOR = "summator";
export const CMD_GRAMMAR = "grammar";
export const CMD_EXPLAINER = "explainer";
export const CMD_FRIEND = "friend";
export const CMD_PROFESSIONAL = "professional";
export const CMD_PROMPT_BUILDER = "promptBuilder";
export const CMD_SHORTER = "shorter";
export const CMD_LONGER = "longer";
export const CMD_REPHRASER = "rephraser";
export const CMD_ASK = "ask";
export const CMD_SCR_MARKDOWN = "screenshotToMarkdown";
export const CMD_SCR_EXPLAIN = "screenshotToExplain";
export const CMD_SCR_TRANSLATE = "screenshotToTranslate";
export const CMD_HISTORY = "history";
export const CMD_STATS = "stats";

export interface GemAiCommand {
  id: string;
  name: string;
  description: string;
  ui_placeholder?: string;
}

const allCommands: Record<string, GemAiCommand> = {
  translator: {
    id: "translator",
    name: "Translator",
    description: "Translate selected text.",
    ui_placeholder: "Enter text to translate.",
  },
  summator: {
    id: "summator",
    name: "Summarize It",
    description: "Summary selected text.",
    ui_placeholder: "Enter text to summarize it",
  },
  grammar: {
    id: "grammar",
    name: "Fix Grammar & Spelling",
    description: "Fix correct grammar, spelling, punctuation for selected text.",
    ui_placeholder: "Enter text to correcte grammar",
  },
  explainer: {
    id: "explainer",
    name: "Explain It",
    description: "Explain selected text.",
    ui_placeholder: "Enter text to explain it",
  },
  friend: {
    id: "friend",
    name: "Friend Text Maker",
    description: "Make text warmer and friendly",
    ui_placeholder: "Enter text to make it warmer",
  },
  professional: {
    id: "professional",
    name: "Professional Text Maker",
    description: "Make text formal and professional",
    ui_placeholder: "Enter text to make it formal",
  },
  promptBuilder: {
    id: "promptBuilder",
    name: "Prompt Builder",
    description: "Create or improve your prompt",
    ui_placeholder: "Enter any idea for new prompt",
  },
  shorter: {
    id: "shorter",
    name: "Shorter Text Maker",
    description: "Make selected text significantly shorter and more concise.",
    ui_placeholder: "Enter text to make it shorter",
  },
  longer: {
    id: "longer",
    name: "Longer Text Maker",
    description: "Make selected text significantly longer.",
    ui_placeholder: "Enter text to make it longer",
  },
  rephraser: {
    id: "rephraser",
    name: "Rephrase It",
    description: "Rewrite the provided text using different phrasing while maintaining the original meaning.",
    ui_placeholder: "Enter text to rephrase it",
  },
  ask: {
    id: "ask",
    name: "Ask GemAI",
    description: "Ask AI any question on any topic.",
    ui_placeholder: "Ask me any question",
  },
  screenshotToMarkdown: {
    id: "screenshotToMarkdown",
    name: "Screenshot -> Markdown",
    description: "Take a screenshot and convert it to markdown.",
    ui_placeholder: "Additional instructions if any",
  },
  screenshotToExplain: {
    id: "screenshotToExplain",
    name: "Screenshot -> Explain",
    description: "Take a screenshot and analyze it, and answer the user's question (if applicable).",
    ui_placeholder: "Additional instructions if any",
  },
  screenshotToTranslate: {
    id: "screenshotToTranslate",
    name: "Screenshot -> Translate",
    description: "Take a screenshot and translate it.",
    ui_placeholder: "Additional instructions if any",
  },
  history: {
    id: "history",
    name: "GemAI - History",
    description: "Show history of chating with AI.",
  },
  stats: {
    id: "stats",
    name: "GemAI - Stats",
    description: "Show usage insides, stats and costs",
  },
};

export function getCmd(commandId: string): GemAiCommand {
  const command = allCommands[commandId];
  if (!command) throw new Error(`Unknown command: ${commandId}`);

  return command;
}

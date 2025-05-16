export const CMD_TRANSLATOR = "CMD_TRANSLATOR";
export const CMD_SUMMATOR = "CMD_SUMMATOR";
export const CMD_GRAMMAR = "CMD_GRAMMAR";
export const CMD_EXPLAINER = "CMD_EXPLAINER";

export interface GemAiCommand {
  id: string;
  name: string;
  description: string;
  ui_placeholder: string;
}

const allCommands: Record<string, GemAiCommand> = {
  CMD_TRANSLATOR: {
    id: "translator",
    name: "Translator",
    description: "Translate selected text.",
    ui_placeholder: "Enter text to translate.",
  },
  CMD_SUMMATOR: {
    id: "summator",
    name: "Summarize It",
    description: "Summary selected text.",
    ui_placeholder: "Enter text to summarize it",
  },
  CMD_GRAMMAR: {
    id: "grammar",
    name: "Fix Grammar & Spelling",
    description: "Fix correct grammar, spelling, punctuation for selected text.",
    ui_placeholder: "Enter text to correcte grammar",
  },
  CMD_EXPLAINER: {
    id: "explainer",
    name: "Explain It",
    description: "Explain selected text.",
    ui_placeholder: "Enter text to explain it",
  },
};


export function getCmd(commandId: string): GemAiCommand {
  const command = allCommands[commandId];
  if (!command) throw new Error(`Unknown command: ${commandId}`);

  return command;
}

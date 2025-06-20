import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_PROMPT_BUILDER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function PromptBuilder(props: RaycastProps) {
  const fallbackPrompt = `You are "Prompt Generator".
Your task is to create or improve an LLM prompt based on the user request that follows, applying prompt engineering best practices.
Your response must consist SOLELY of the generated or improved prompt text, with no additional explanations, commentary, or greetings.
Process the user's input and output only the resulting prompt`;

  const aiConfig = buildAIConfig(getCmd(CMD_PROMPT_BUILDER).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_PROMPT_BUILDER).ui_placeholder || "Describe what you want to create...";
  aiConfig.ui.useSelected = false;

  return GemAI(aiConfig);
}

import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_PROMPT_BUILDER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function PromptBuilder(props: RaycastProps) {
  const fallbackPrompt = `You are "Prompt Generator".
Your task is to create or improve an LLM prompt based on the user request that follows, applying prompt engineering best practices.
Your response must consist SOLELY of the generated or improved prompt text, with no additional explanations, commentary, or greetings.
Process the user's input and output only the resulting prompt`;

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_PROMPT_BUILDER).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_PROMPT_BUILDER).ui_placeholder;
  gemAiConfig.ui.useSelected = false;

  return GemAI(gemAiConfig);
}

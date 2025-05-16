import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_SHORTER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Shorter(props: RaycastProps) {
  const fallbackPrompt = `You are a professional editor specializing in creating concise texts.
Your task is to take the following text and make it significantly shorter and more concise, while preserving all the original meaning and key information.
Do not add new ideas or information. Focus on removing redundant words, phrases, and sentences that do not carry significant semantic load.
ALWAYS present the result ONLY as the final, shortened text.`;

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_SHORTER).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_SHORTER).ui_placeholder;
  gemAiConfig.model.topP = 0.9;

  return GemAI(gemAiConfig);
}

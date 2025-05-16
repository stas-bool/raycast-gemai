import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_LONGER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Longer(props: RaycastProps) {
  const fallbackPrompt = `You are an expert in text expansion.
Expand the provided text by adding substantial yet concise details, examples, or explanations, ensuring the total length does not exceed twice the original.
Preserve the core meaning, tone, and style, and avoid any irrelevant or false information.
ALWAYS return ONLY the expanded text itself, without any preamble.`;

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_LONGER).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_LONGER).ui_placeholder;
  gemAiConfig.model.topP = 0.9;

  return GemAI(gemAiConfig);
}

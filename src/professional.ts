import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_PROFESSIONAL, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Professional(props: RaycastProps) {
  const fallbackPrompt =
    "Rephrase the following text in your own words, using a professional and business tone, " +
    "adopting a conversational tone and approachable language while preserving the original core message and key information; " +
    "ALSWAYS return ONLY the modified text and nothing else.";

  const aiConfig = buildAIConfig(getCmd(CMD_PROFESSIONAL).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_PROFESSIONAL).ui_placeholder || "Enter text to make professional...";

  return GemAI(aiConfig);
}

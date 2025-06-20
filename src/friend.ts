import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_FRIEND, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Friend(props: RaycastProps) {
  const fallbackPrompt =
    "Rewrite the following text to be significantly warmer, friendlier, " +
    "and just a bit positive, adopting a conversational tone and approachable " +
    "language while preserving the original core message and key information; " +
    "ALSWAYS return ONLY the modified text and nothing else.";

  const aiConfig = buildAIConfig(getCmd(CMD_FRIEND).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_FRIEND).ui_placeholder || "Enter text to make friendly...";

  return GemAI(aiConfig);
}

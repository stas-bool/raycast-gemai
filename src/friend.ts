import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_FRIEND, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Friend(props: RaycastProps) {
  const fallbackPrompt =
    "Rewrite the following text to be significantly warmer, friendlier, " +
    "and just a bit positive, adopting a conversational tone and approachable " +
    "language while preserving the original core message and key information; " +
    "ALSWAYS return ONLY the modified text and nothing else.";

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_FRIEND).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_FRIEND).ui_placeholder;

  return GemAI(gemAiConfig);
}

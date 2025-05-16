import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_EXPLAINER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Explainer(props: RaycastProps) {
  const fallbackPrompt =
    "Explain the meanings of the provided word or sentence as accurately as possible, " +
    "briefly and structured, using lists only if truly necessary. " +
    "Do not use introductory phrases, greetings, or repeat the request. " +
    "ALWAYS return ONLY the explanation itself and nothing more.";

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_EXPLAINER).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_EXPLAINER).ui_placeholder;

  return GemAI(gemAiConfig);
}

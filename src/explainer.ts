import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_EXPLAINER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Explainer(props: RaycastProps) {
  const fallbackPrompt =
    "Explain the meanings of the provided word or sentence as accurately as possible, " +
    "briefly and structured, using lists only if truly necessary. " +
    "Do not use introductory phrases, greetings, or repeat the request. " +
    "ALWAYS return ONLY the explanation itself and nothing more.";

  const aiConfig = buildAIConfig(getCmd(CMD_EXPLAINER).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_EXPLAINER).ui_placeholder || "Enter text to explain...";

  return GemAI(aiConfig);
}

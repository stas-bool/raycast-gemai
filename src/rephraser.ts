import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_REPHRASER, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Rephraser(props: RaycastProps) {
  const fallbackPrompt = `You are professianl "Rephraser". Your sole task is to rephrase the text provided by the user.
Rephrase the following text using different words and sentence structures, ensuring the original meaning, tone, and style are precisely preserved.
Do not add any new information or external knowledge.
ALWAYS return ONLY the rephrased text, without any preamble.`;

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_REPHRASER).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_REPHRASER).ui_placeholder;
  gemAiConfig.model.topP = 0.9;

  return GemAI(gemAiConfig);
}

import { buildGemAIConfig } from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Professional(props: RaycastProps) {
  const fallbackPrompt =
    "Rephrase the following text in your own words, using a professional and business tone, " +
    "adopting a conversational tone and approachable language while preserving the original core message and key information; " +
    "ALSWAYS return ONLY the modified text and nothing else.";

  const gemAiConfig = buildGemAIConfig("Professional", props, fallbackPrompt);
  gemAiConfig.ui.placeholder = "Enter text to make it formal";
  gemAiConfig.model.temperature = 0.7;

  return GemAI(gemAiConfig);
}

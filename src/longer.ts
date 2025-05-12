import { buildGemAIConfig } from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Longer(props: RaycastProps) {
  const fallbackPrompt = `You are an expert in text expansion.
Expand the provided text by adding substantial yet concise details, examples, or explanations, ensuring the total length does not exceed twice the original.
Preserve the core meaning, tone, and style, and avoid any irrelevant or false information.
ALWAYS return ONLY the expanded text itself, without any preamble.`;

  const gemAiConfig = buildGemAIConfig("Longer", props, fallbackPrompt);
  gemAiConfig.ui.placeholder = "Enter text to make it longer";
  gemAiConfig.model.temperature = 0.7;

  return GemAI(gemAiConfig);
}

import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import {RaycastProps} from "./core/types";

export default function Shorter(props: RaycastProps) {
    const fallbackPrompt = `You are a professional editor specializing in creating concise texts.
Your task is to take the following text and make it significantly shorter and more concise, while preserving all the original meaning and key information.
Do not add new ideas or information. Focus on removing redundant words, phrases, and sentences that do not carry significant semantic load.
ALWAYS present the result ONLY as the final, shortened text.`;

    const gemAiConfig = buildGemAIConfig("Shorter", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter text to make it shorter";

    return GemAI(gemAiConfig);
}

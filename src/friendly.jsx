import {getPreferenceValues} from "@raycast/api";
import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Friendly(props) {
    const fallbackPrompt = "Rewrite the following text to be significantly warmer, friendlier, " +
        "and just a bit positive, adopting a conversational tone and approachable " +
        "language while preserving the original core message and key information; " +
        "ALSWAYS return ONLY the modified text and nothing else.";

    const gemAiConfig = buildGemAIConfig("Friendly", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter text to make it warmer";
    gemAiConfig.model.temperature = 0.9;

    return GemAI(gemAiConfig);
}

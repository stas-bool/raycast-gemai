import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Friend(props: object) {
    const fallbackPrompt = "Rewrite the following text to be significantly warmer, friendlier, " +
        "and just a bit positive, adopting a conversational tone and approachable " +
        "language while preserving the original core message and key information; " +
        "ALSWAYS return ONLY the modified text and nothing else.";

    const gemAiConfig = buildGemAIConfig("Friend", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter text to make it warmer";
    gemAiConfig.model.temperature = 0.7;

    return GemAI(gemAiConfig);
}

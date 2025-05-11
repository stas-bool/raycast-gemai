import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Explainer(props: object) {
    const fallbackPrompt = "Explain the meanings of the provided word or sentence as accurately as possible, " +
        "briefly and structured, using lists only if truly necessary. " +
        "Do not use introductory phrases, greetings, or repeat the request. " +
        "ALWAYS return ONLY the explanation itself and nothing more.";

    const gemAiConfig = buildGemAIConfig("Explainer", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter text to explain it";

    return GemAI(gemAiConfig);
}

import {getPreferenceValues} from "@raycast/api";
import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Explain(props) {
    const fallbackPrompt = "Explain the meanings of the provided word or sentence as accurately as possible, " +
        "briefly and structured, using lists only if truly necessary. " +
        "Do not use introductory phrases, greetings, or repeat the request. " +
        "ALWAYS return ONLY the explanation itself and nothing more.";

    [request, model, ui] = buildGemAIConfig("Explain", props, fallbackPrompt);

    return GemAI(request, model, ui);
}

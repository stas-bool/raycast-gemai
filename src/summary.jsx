import {getPreferenceValues} from "@raycast/api";
import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import {dump} from "./core/utils";

export default function Summary(props) {
    const prefs = getPreferenceValues();

    const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
    const fallbackPrompt = `Summarize the following text very concisely
(3-10 sentences; for very long texts, up to 15 sentences and a list of key points),
conveying only the main ideas, facts, and conclusions. If the original text is already brief, return its essence.
Provide the response in ${pimaryLang}, strictly objectively and clearly,
returning EXCLUSIVELY the summary itself, without any explanations.`;

    [request, model, ui] = buildGemAIConfig("Summary", props, fallbackPrompt);

     return GemAI(request, model, ui);
}

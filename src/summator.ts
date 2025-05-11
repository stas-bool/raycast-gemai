import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Summator(props: object) {
    const fallbackPrompt = `Summarize the following text very concisely
(3-10 sentences; for very long texts, up to 15 sentences and a list of key points),
conveying only the main ideas, facts, and conclusions. If the original text is already brief, return its essence.
Provide the response objectively and clearly, returning EXCLUSIVELY the summary itself, without any explanations.`;

    const gemAiConfig = buildGemAIConfig("Summator", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter text to summarize it";

    return GemAI(gemAiConfig);
}

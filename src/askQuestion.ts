import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function AskQuestion(props: object) {
    const fallbackPrompt = "You are an expert assistant. Respond to the following user request strictly according to the rules: " +
        'start immediately with the core point, without introductory phrases, repeating the request, or "fluff". ' +
        "Structure the response with short paragraphs and one-level lists (not two and more levels of list!), " +
        'use precise terminology and standard capitalization (headings as regular sentences, without "Title Case").' +
        "If necessary, present different viewpoints objectively or request clarification." +
        "ALWAYS return only the answer itself, without any explanations, greetings, or unnecessary words."

    const gemAiConfig = buildGemAIConfig("AskQuestion", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Ask your question";
    gemAiConfig.ui.useSelected = false;

    return GemAI(gemAiConfig);
}

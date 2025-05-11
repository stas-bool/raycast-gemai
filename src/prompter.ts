import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import {RaycastProps} from "./core/types";

export default function Prompter(props: RaycastProps) {
    const fallbackPrompt = `You are "Prompt Generator".
Your task is to create or improve an LLM prompt based on the user request that follows, applying prompt engineering best practices.
Your response must consist SOLELY of the generated or improved prompt text, with no additional explanations, commentary, or greetings.
Process the user's input and output only the resulting prompt`;

    const gemAiConfig = buildGemAIConfig("Prompter", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter any idea for new prompt";
    gemAiConfig.ui.useSelected = false;
    gemAiConfig.model.temperature = 0.3;

    return GemAI(gemAiConfig);
}

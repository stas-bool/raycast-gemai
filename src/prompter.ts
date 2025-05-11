import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

export default function Prompter(props: object) {

    const fallbackPrompt = `You are a specialized AI "Prompt Generator".
Your sole task is to create a ready-to-use prompt for other LLMs based on the user's structured request.
Do not communicate, ask questions, or comment on your work or the request.
Always return ONLY the generated prompt in markdown format.
The response MUST be formatted as code, i.e., enclosed in three backticks

\`\`\`markdown
[HERE YOU PLACE THE FULLY FORMED PROMPT THAT YOU CREATED BASED ON THE USER'S REQUEST. THIS PROMPT IS READY TO BE COPIED AND USED IN ANOTHER LLM.]
\`\`\`
`;

    const gemAiConfig = buildGemAIConfig("Prompter", props, fallbackPrompt);
    gemAiConfig.ui.placeholder = "Enter any idea for new prompt";
    gemAiConfig.ui.useSelected = false;

    return GemAI(gemAiConfig);
}

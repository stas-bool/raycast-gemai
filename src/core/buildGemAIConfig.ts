import {getPreferenceValues} from "@raycast/api";
import {GeminiRequestParams, GeminiModelParams, RaycastUIParams} from "./types";
import {getSystemPrompt} from "./utils";

const thinkingModels = [
    'gemini-2.5-flash-preview-04-17',
    'gemini-2.5-pro-preview-05-06'
];


function buildRealPrompt(actionName: string, prefs: any, fallbackPrompt?: string): string {
    const systemPrompt = getSystemPrompt(prefs.promptDir + "/" + prefs.promptFile, fallbackPrompt);
    const primaryLanguage = prefs.primaryLanguage.trim().toUpperCase()
    const defaultLanguage = `## Language Instruction Layer

**Default Response Language:** ${primaryLanguage}.

**Condition:** If a specific instruction to use a different language (e.g., "translate to English",
"respond in French", "in Spanish please") is present either in the main body of the current prompt OR in any
subsequent user messages within this conversation, please prioritize and follow that explicit language instruction.
Otherwise, adhere to the Default Response Language specified above (${primaryLanguage}).

---

`;

    return actionName.toLocaleLowerCase().trim() === "translate"
        ? systemPrompt
        : `${defaultLanguage}\n${systemPrompt}`;
}

export function buildGemAIConfig(actionName: string, props: any, fallbackPrompt?: string): [GeminiRequestParams, GeminiModelParams, RaycastUIParams] {
    const prefs = getPreferenceValues();

    // Select model name
    const isCustomModelValid = Boolean(prefs.customModel && prefs.customModel.trim().length > 0);
    const modelName = isCustomModelValid ? prefs.customModel : prefs.defaultModel;
    //const modelName = prefs.commandModel === "default" ? defaultModel : prefs.commandModel;

    // Thinking mode if any
    const thinkingConfig = {includeThoughts: false, thinkingBudget: 4000};

    // Prepare model configuration
    const model: GeminiModelParams = {
        geminiApiKey: prefs.geminiApiKey.trim(),
        modelName: modelName.trim(),
        systemPrompt: buildRealPrompt(actionName, prefs, fallbackPrompt),
        ...(thinkingModels.includes(modelName.trim()) && {thinkingConfig}),
        maxOutputTokens: 32000,
        temperature: 0.3,
        topP: 0.94,
        topK: 0,
        frequencyPenalty: 0,
        presencePenalty: 0,
    };

    // Prepare model request
    const request: GeminiRequestParams = {
        actionName: actionName,
        origProps: props,
        primaryLanguage: prefs.primaryLanguage,
        userPrompt: props.arguments?.query || props.fallbackText || "",
    };

    // Prepare Raycast UI
    const ui: RaycastUIParams = {
        placeholder: "Your question to AI here",
        allowPaste: true,
        useSelected: true,
    };

    return [request, model, ui];
}

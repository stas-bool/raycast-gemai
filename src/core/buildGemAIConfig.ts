import {getPreferenceValues} from "@raycast/api";
import {GeminiRequestParams, GeminiModelParams, RaycastUIParams} from "./types";
import {getSystemPrompt} from "./utils";

export function buildGemAIConfig(actionName: string, props: any, fallbackPrompt?: string): [GeminiRequestParams, GeminiModelParams, RaycastUIParams] {
    const prefs = getPreferenceValues();

    const isCustomModelValid = Boolean(prefs.customModel && prefs.customModel.trim().length > 0);
    const modelName = isCustomModelValid ? prefs.customModel : prefs.defaultModel;
    //const modelName = prefs.commandModel === "default" ? defaultModel : prefs.commandModel;

    const systemPrompt = getSystemPrompt(prefs.promptDir + "/" + prefs.promptFile, fallbackPrompt)

    const request: GeminiRequestParams = {
        actionName: actionName,
        origProps: props,
        primaryLanguage: prefs.primaryLanguage,
        userPrompt: props.arguments?.query || props.fallbackText || "",
    };

    const thinkingConfig = {includeThoughts: false, thinkingBudget: 4000};
    const thinkingModels = ['gemini-2.5-flash-preview-04-17', 'gemini-2.5-pro-preview-05-06'];

    const model: GeminiModelParams = {
        geminiApiKey: prefs.geminiApiKey.trim(),
        modelName: modelName.trim(),
        systemPrompt: systemPrompt,

        ...(thinkingModels.includes(modelName.trim()) && {thinkingConfig}),
        maxOutputTokens: 32000,

        temperature: 0.5,
        topP: 0.94,
        topK: 0,

        frequencyPenalty: 0,
        presencePenalty: 0,


    };

    const ui: RaycastUIParams = {
        placeholder: "Your question for AI here...",
        allowPaste: true,
        useSelected: false,
    };

    return [request, model, ui];
}

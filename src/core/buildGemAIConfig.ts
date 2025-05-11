import {getPreferenceValues} from "@raycast/api";
import {GemAIConfig, RaycastProps} from "./types";
import {getSystemPrompt} from "./utils";

const allModels = {
    'gemini-2.0-flash-lite': "Gemini 2.0 Flash-Lite",
    'gemini-2.0-flash': "Gemini 2.0 Flash",
    'gemini-2.5-flash-preview-04-17': "Gemini 2.5 Flash Preview",
    'gemini-2.5-pro-preview-05-06': "Gemini 2.5 Pro Preview",
};

const thinkingModels = [
    'gemini-2.5-flash-preview-04-17',
    'gemini-2.5-pro-preview-05-06',
];

const actionsWithPrimaryLanguage = [
    'askquestion',
    'explainer',
    'prompter',
    'summator',
    'screenshottoexplain',
];

function buildRealPrompt(actionName: string, prefs: any, fallbackPrompt?: string): [boolean, string] {
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

    const prompt = actionsWithPrimaryLanguage.includes(actionName.toLocaleLowerCase().trim())
        ? `${defaultLanguage}\n\n${systemPrompt}`
        : systemPrompt;

    return [systemPrompt.trim() !== fallbackPrompt.trim(), prompt];
}

function getCurrentModel(prefs: any): string {
    const isCustomModelValid = Boolean(prefs.customModel && prefs.customModel.trim().length > 0);
    const globalModelName = isCustomModelValid ? prefs.customModel.toLowerCase().trim() : prefs.defaultModel;

    return prefs.commandModel === "default" ? globalModelName : prefs.commandModel;
}

export function buildGemAIConfig(actionName: string, props: RaycastProps, fallbackPrompt?: string): GemAIConfig {
    const prefs = getPreferenceValues();

    const currentModelName = getCurrentModel(prefs);

    // Thinking mode if any
    const thinkingConfig = {includeThoughts: false, thinkingBudget: 1000};
    const [isCustomPrompt, realSystemPrompt] = buildRealPrompt(actionName, prefs, fallbackPrompt);

    return {
        model: {
            geminiApiKey: prefs.geminiApiKey.trim(),
            modelName: currentModelName,
            modelNameUser: (allModels[currentModelName] ?? currentModelName) + (isCustomPrompt ? ' 💭' : ''),
            maxOutputTokens: 16000,
            ...(thinkingModels.includes(currentModelName) && {thinkingConfig}),
            temperature: 0.3,
            topP: 0.94,
            topK: 0,
            frequencyPenalty: 0,
            presencePenalty: 0,
            systemPrompt: realSystemPrompt,
        },

        request: {
            actionName: actionName,
            origProps: props,
            primaryLanguage: prefs.primaryLanguage,
            userPrompt: props.arguments?.query || props.fallbackText || "",
        },

        ui: {
            placeholder: "Your question to AI here",
            allowPaste: true,
            useSelected: true,
        }
    }
}

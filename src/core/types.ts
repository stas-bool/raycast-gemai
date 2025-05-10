export interface GeminiRequestParams {
    primaryLanguage: string;
    userPrompt: string;
    attachmentFile?: string;
    selectedText?: string;
}

export interface GeminiModelParams {
    geminiApiKey: string;
    systemPrompt: string;
    modelName: string;
    maxOutputTokens: number;
    temperature: number;
    topK: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    thinkingBudget: number;
}

export interface RaycastUIParams {
    placeholder: string;
    allowPaste: boolean;
    useSelected: boolean;
}

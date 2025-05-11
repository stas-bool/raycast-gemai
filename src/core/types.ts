export interface GeminiRequestParams {
    actionName: string;
    origProps: object;
    primaryLanguage: string;
    userPrompt: string;
    attachmentFile?: string;
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
    thinkingConfig?: {
        includeThoughts?: boolean;
        thinkingBudget?: number;
    }
}

export interface RaycastUIParams {
    placeholder: string;
    allowPaste: boolean;
    useSelected: boolean;
}

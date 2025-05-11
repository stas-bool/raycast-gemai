export interface GemAIConfig {
    request: {
        actionName: string;
        origProps: object;
        primaryLanguage: string;
        userPrompt: string;
        attachmentFile?: string;
    },
    model: {
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
    },
    ui: {
        placeholder: string;
        allowPaste: boolean;
        useSelected: boolean;
    }
}

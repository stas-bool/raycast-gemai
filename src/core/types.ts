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
        modelNameUser: string;
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

export interface RaycastProps {
    arguments: {
        query?: string;
        [key: string]: unknown;
    };
    fallbackText?: string;
    launchType: string;
    launchContext?: {
        props?: RaycastProps;
        attachmentFile?: string;
        gemAiConfig?: GemAIConfig
        [key: string]: unknown;
    };
}

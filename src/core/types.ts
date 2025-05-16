import { SafetySetting } from "@google/genai";

export interface GemAIConfig {
  request: {
    actionName: string;
    origProps: object;
    primaryLanguage: string;
    userPrompt: string;
    attachmentFile?: string;
  };
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
    };
    safetySettings: SafetySetting[];
  };
  ui: {
    placeholder: string;
    allowPaste: boolean;
    useSelected: boolean;
  };
}

export interface HistoryItem {
  timestamp: number;
  actionName: string;
  model: string;
  query: string;
  isAttachmentFile?: boolean;
  response: string;
  requestStats: RequestStats;
  stats?: string;
}

export interface RequestStats {
  prompt: number;
  input: number;
  thoughts: number;
  total: number;
  totalTime: number;
  firstRespTime: number;
}

export interface HistoryStats {
  hour: number;
  day: number;
  week: number;
  month: number;
  total: number;
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
    gemAiConfig?: GemAIConfig;
    [key: string]: unknown;
  };
}

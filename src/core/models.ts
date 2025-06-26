export const DEFAULT_MODEL_IDIOT = "gemini-2.0-flash-lite";
export const DEFAULT_MODEL_STUPID = "gemini-2.0-flash";
export const DEFAULT_MODEL = "gemini-2.5-flash-preview-04-17";
export const DEFAULT_MODEL_SMART = "gemini-2.5-flash-preview-04-17__thinking";
export const DEFAULT_MODEL_SUPER = "gemini-2.5-pro-preview-05-06";

// OpenAI model defaults
export const DEFAULT_OPENAI_MODEL = "gpt-4o";
export const DEFAULT_OPENAI_MODEL_MINI = "gpt-4o-mini";

export const DEFAULT_TEMP = 0.1;
export const DEFAULT_TEMP_CREATIVE = 0.6;
export const DEFAULT_TEMP_ARTIST = 1.0;

export interface ModelInfo {
  id: string;
  name: string;
  price_input: number;
  price_output: number;
  price_output_thinking: number;
  thinking_budget: number;
  provider?: "gemini" | "openai";
  supportsVision?: boolean;
}

/**
 * Determines provider for custom models based on common naming patterns
 */
export function detectProviderFromModelName(modelName: string): "openai" | "gemini" {
  const lowerModelName = modelName.toLowerCase();

  // OpenAI model patterns
  if (
    lowerModelName.includes("gpt") ||
    lowerModelName.includes("o1") ||
    lowerModelName.includes("chatgpt") ||
    lowerModelName.includes("claude") || // Anthropic models often work with OpenAI API
    lowerModelName.includes("anthropic") || // Explicit Anthropic models
    lowerModelName.includes("llama") || // Local LLaMA deployments
    lowerModelName.includes("mistral") || // Mistral models
    lowerModelName.includes("azure") // Azure OpenAI
  ) {
    return "openai";
  }

  // Default to gemini for backward compatibility
  return "gemini";
}

/**
 * Gets custom model pricing from preferences
 */
export function getCustomModelPricing(prefs: any): { inputPrice?: number; outputPrice?: number } {
  const inputPrice = prefs.customModelInputPrice?.trim();
  const outputPrice = prefs.customModelOutputPrice?.trim();

  return {
    inputPrice: inputPrice && inputPrice !== "" ? parseFloat(inputPrice) : undefined,
    outputPrice: outputPrice && outputPrice !== "" ? parseFloat(outputPrice) : undefined,
  };
}

/**
 * Gets model info for any model, including custom models with pricing
 */
export function getModelInfo(modelName: string, prefs?: any): ModelInfo {
  const existingModel = allModels[modelName];

  if (existingModel) {
    return existingModel;
  }

  // For custom models, create ModelInfo with custom pricing or defaults
  const customPricing = prefs ? getCustomModelPricing(prefs) : {};

  // Default pricing for unknown models (conservative estimates)
  const defaultInputPrice = 1.0; // $1.00 per 1M tokens
  const defaultOutputPrice = 3.0; // $3.00 per 1M tokens

  return {
    id: modelName,
    name: modelName,
    price_input: customPricing.inputPrice ?? defaultInputPrice,
    price_output: customPricing.outputPrice ?? defaultOutputPrice,
    price_output_thinking: customPricing.outputPrice ?? defaultOutputPrice,
    thinking_budget: 0,
    provider: detectProviderFromModelName(modelName),
    supportsVision: true, // Assume vision support for custom models
  };
}

export const allModels: Record<string, ModelInfo> = {
  "gemini-2.0-flash-lite": {
    id: "gemini-2.0-flash-lite",
    name: "2.0 Flash-Lite",
    price_input: 0.075,
    price_output: 0.3,
    price_output_thinking: 0.3,
    thinking_budget: 0,
    provider: "gemini",
    supportsVision: true,
  },
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "2.0 Flash",
    price_input: 0.1,
    price_output: 0.4,
    price_output_thinking: 0.4,
    thinking_budget: 0,
    provider: "gemini",
    supportsVision: true,
  },
  "gemini-2.5-flash-preview-04-17": {
    id: "gemini-2.5-flash-preview-04-17",
    name: "2.5 Flash",
    price_input: 0.15,
    price_output: 0.6,
    price_output_thinking: 3.5,
    thinking_budget: 0,
    provider: "gemini",
    supportsVision: true,
  },
  "gemini-2.5-flash-preview-04-17__thinking": {
    id: "gemini-2.5-flash-preview-04-17",
    name: "2.5 Flash Thinking",
    price_input: 0.15,
    price_output: 0.6,
    price_output_thinking: 3.5,
    thinking_budget: 2000,
    provider: "gemini",
    supportsVision: true,
  },
  "gemini-2.5-pro-preview-05-06": {
    id: "gemini-2.5-pro-preview-05-06",
    name: "2.5 Pro",
    price_input: 1.25,
    price_output: 10,
    price_output_thinking: 10,
    thinking_budget: 4000,
    provider: "gemini",
    supportsVision: true,
  },
  // OpenAI Models
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    price_input: 2.5,
    price_output: 10.0,
    price_output_thinking: 10.0,
    thinking_budget: 0,
    provider: "openai",
    supportsVision: true,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    price_input: 0.15,
    price_output: 0.6,
    price_output_thinking: 0.6,
    thinking_budget: 0,
    provider: "openai",
    supportsVision: true,
  },
  "o1-preview": {
    id: "o1-preview",
    name: "o1-preview (Reasoning)",
    price_input: 15.0,
    price_output: 60.0,
    price_output_thinking: 60.0,
    thinking_budget: 32768, // 32K thinking tokens budget for reasoning model
    provider: "openai",
    supportsVision: false,
  },
  "o1-mini": {
    id: "o1-mini",
    name: "o1-mini (Reasoning)",
    price_input: 3.0,
    price_output: 12.0,
    price_output_thinking: 12.0,
    thinking_budget: 65536, // 65K thinking tokens budget for reasoning model
    provider: "openai",
    supportsVision: false,
  },
};

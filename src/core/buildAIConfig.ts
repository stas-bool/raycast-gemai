import { getPreferenceValues } from "@raycast/api";
import { buildGemAIConfig } from "./buildGemAIConfig";
import { buildOpenAIConfig } from "./buildOpenAIConfig";
import { allModels } from "./models";
import { AIConfig, GemAIConfig, RaycastProps } from "./types";

/**
 * Determines the current model from preferences
 */
function getCurrentModel(prefs: any): string {
  const isCustomModelValid = Boolean(prefs.customModel && prefs.customModel.trim().length > 0);
  const globalModelName = isCustomModelValid ? prefs.customModel.toLowerCase().trim() : prefs.defaultModel;
  return prefs.commandModel === "default" ? globalModelName : prefs.commandModel;
}

/**
 * Determines provider for custom models based on common naming patterns
 */
function detectProviderFromModelName(modelName: string): 'openai' | 'gemini' {
  const lowerModelName = modelName.toLowerCase();
  
  // OpenAI model patterns
  if (lowerModelName.includes('gpt') || 
      lowerModelName.includes('o1') ||
      lowerModelName.includes('chatgpt') ||
      lowerModelName.includes('claude') ||  // Anthropic models often work with OpenAI API
      lowerModelName.includes('llama') ||   // Local LLaMA deployments
      lowerModelName.includes('mistral') || // Mistral models
      lowerModelName.includes('azure')) {   // Azure OpenAI
    return 'openai';
  }
  
  // Default to gemini for backward compatibility
  return 'gemini';
}

/**
 * Universal AI configuration builder that routes to appropriate provider
 * based on the selected model's provider field in models.ts
 */
export function buildAIConfig(actionName: string, props: RaycastProps, fallbackPrompt?: string): AIConfig | GemAIConfig {
  const prefs = getPreferenceValues();
  const currentModelName = getCurrentModel(prefs);
  
  // Get provider from model definition or detect for custom models
  const modelInfo = allModels[currentModelName];
  let provider: 'openai' | 'gemini';
  
  if (modelInfo) {
    // Use defined model provider
    provider = modelInfo.provider || 'gemini';
  } else {
    // For custom models, detect provider based on model name patterns
    provider = detectProviderFromModelName(currentModelName);
    // console.log(`Custom model detected: ${currentModelName} -> provider: ${provider}`);
  }
  
  // Route to appropriate provider configuration
  switch (provider) {
    case 'openai':
      return buildOpenAIConfig(actionName, props, fallbackPrompt);
    
    case 'gemini':
    default:
      // For Gemini, return the legacy GemAIConfig for backward compatibility
      return buildGemAIConfig(actionName, props, fallbackPrompt);
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use buildAIConfig instead
 */
export function buildGemAIConfigCompat(actionName: string, props: RaycastProps, fallbackPrompt?: string): GemAIConfig {
  const config = buildAIConfig(actionName, props, fallbackPrompt);
  
  // Ensure backward compatibility by casting to GemAIConfig if it's Gemini
  if (config.provider === 'gemini') {
    return config as GemAIConfig;
  }
  
  // If somehow we get an OpenAI config, throw an error for this legacy function
  throw new Error("buildGemAIConfigCompat can only be used with Gemini models");
} 
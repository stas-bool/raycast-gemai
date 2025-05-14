import { HarmBlockThreshold, HarmCategory } from "@google/genai";
import { getPreferenceValues } from "@raycast/api";
import { GemAIConfig, RaycastProps } from "./types";
import { getSystemPrompt } from "./utils";

const allModels = {
  "gemini-2.0-flash-lite": "2.0 Flash Lite",
  "gemini-2.0-flash": "2.0 Flash",
  "gemini-2.5-flash-preview-04-17": "2.5 Flash",
  "gemini-2.5-pro-preview-05-06": "2.5 Pro",
};

const thinkingModels = ["gemini-2.5-flash-preview-04-17", "gemini-2.5-pro-preview-05-06"];
const actionsWithPrimaryLanguage = ["askquestion", "explainer", "prompter", "summator", "screenshottoexplain"];

function buildRealPrompt(actionName: string, prefs: any, fallbackPrompt?: string): [boolean, string] {
  const systemPrompt = getSystemPrompt(prefs.promptDir + "/" + prefs.promptFile, fallbackPrompt);
  const primaryLanguage = prefs.primaryLanguage.trim().toUpperCase();

  const defaultLanguage = `## Language Policy
**Default Response Language:** ${primaryLanguage}.
**Condition:** If a specific instruction to use a different language (e.g., "translate to English",
"respond in French", "in Spanish please") is present either in the main body of the current prompt OR in any
subsequent user messages within this conversation, please prioritize and follow that explicit language instruction.
Otherwise, adhere to the Default Response Language specified above (${primaryLanguage}).`;

  const autoLanguage = `### Language Policy
**Response Language Priority:** Your responses should be formulated in the same language as the user's most recent query.
**Ignoring System Instruction Language:** The language in which this system prompt is written (including this instruction) should not affect the language of your response to the user.
**Exception:** If the user explicitly specifies a different language for the response in their query, you must follow that instruction.`;

  const prompt = actionsWithPrimaryLanguage.includes(actionName.toLocaleLowerCase().trim())
    ? `${defaultLanguage}\n\n${systemPrompt}`
    : `${autoLanguage}\n\n${systemPrompt}`;

  return [systemPrompt.trim() !== fallbackPrompt.trim(), prompt];
}

function getTemperature(prefs: any): number {
  const temp = prefs.temperature.trim();
  return parseFloat(temp === "" ? "0.3" : temp);
}

function getCurrentModel(prefs: any): string {
  const isCustomModelValid = Boolean(prefs.customModel && prefs.customModel.trim().length > 0);
  const globalModelName = isCustomModelValid ? prefs.customModel.toLowerCase().trim() : prefs.defaultModel;

  return prefs.commandModel === "default" ? globalModelName : prefs.commandModel;
}

export function buildGemAIConfig(actionName: string, props: RaycastProps, fallbackPrompt?: string): GemAIConfig {
  const prefs = getPreferenceValues();

  const currentModelName = getCurrentModel(prefs);
  const [isCustomPrompt, realSystemPrompt] = buildRealPrompt(actionName, prefs, fallbackPrompt);
  const thinkingConfig = {
    includeThoughts: false,
    thinkingBudget: currentModelName === "gemini-2.5-pro-preview-05-06" ? 16000 : 0,
  };

  return {
    model: {
      geminiApiKey: prefs.geminiApiKey.trim(),
      modelName: currentModelName,
      modelNameUser: (isCustomPrompt ? "💭 " : "") + (allModels[currentModelName] ?? currentModelName),
      maxOutputTokens: 64000,
      ...(thinkingModels.includes(currentModelName) && { thinkingConfig }),
      temperature: getTemperature(prefs),
      topP: 0.95,
      topK: 0,
      frequencyPenalty: 0,
      presencePenalty: 0,
      systemPrompt: realSystemPrompt,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
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
    },
  };
}

export const DEFAULT_MODEL_IDIOT = "gemini-2.0-flash-lite";
export const DEFAULT_MODEL_STUPID = "gemini-2.0-flash";
export const DEFAULT_MODEL = "gemini-2.5-flash-preview-04-17";
export const DEFAULT_MODEL_SMART = "gemini-2.5-flash-preview-04-17__thinking";
export const DEFAULT_MODEL_SUPER = "gemini-2.5-pro-preview-05-06";

export const DEFAULT_TEMP = 0.3;
export const DEFAULT_TEMP_CREATIVE = 0.6;
export const DEFAULT_TEMP_ARTIST = 1.0;

export interface ModelInfo {
  id: string;
  name: string;
  price_input: number;
  price_output: number;
  price_output_thinking: number;
  thinking_budget: number;
}

export const allModels: Record<string, ModelInfo> = {
  "gemini-2.0-flash-lite": {
    id: "gemini-2.0-flash-lite",
    name: "2.0 Flash-Lite",
    price_input: 0.075,
    price_output: 0.3,
    price_output_thinking: 0.3,
    thinking_budget: 0,
  },
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "2.0 Flash",
    price_input: 0.1,
    price_output: 0.4,
    price_output_thinking: 0.4,
    thinking_budget: 0,
  },
  "gemini-2.5-flash-preview-04-17": {
    id: "gemini-2.5-flash-preview-04-17",
    name: "2.5 Flash",
    price_input: 0.15,
    price_output: 0.6,
    price_output_thinking: 3.5,
    thinking_budget: 0,
  },
  "gemini-2.5-flash-preview-04-17__thinking": {
    id: "gemini-2.5-flash-preview-04-17",
    name: "2.5 Flash Thinking",
    price_input: 0.15,
    price_output: 0.6,
    price_output_thinking: 3.5,
    thinking_budget: 2000,
  },
  "gemini-2.5-pro-preview-05-06": {
    id: "gemini-2.5-pro-preview-05-06",
    name: "2.5 Pro",
    price_input: 1.25,
    price_output: 10,
    price_output_thinking: 10,
    thinking_budget: 4000,
  },
};

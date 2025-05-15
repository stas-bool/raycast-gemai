import { getPreferenceValues } from "@raycast/api";
import { buildGemAIConfig } from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function TranslatorThinking(props: RaycastProps) {
  const prefs = getPreferenceValues();
  const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
  const secondLang = prefs.secondaryLanguage.trim().toUpperCase();
  const fallbackPrompt = `Please translate the text (${pimaryLang} <> ${secondLang}),
ensuring the meaning is precisely preserved and the result sounds natural and clear to a native speaker.
To accomplish this, you may reorder words, but ONLY within their original sentence. Please do not distort or simplify the content.
If the following text is in ${pimaryLang} then translate it to ${secondLang}, otherwise translate following text to ${pimaryLang}.
ALSWAYS THINK REALLY HARD. ALSWAYS return ONLY the translated text and nothing else.`;

  const gemAiConfig = buildGemAIConfig("Translator (Thinking)", props, fallbackPrompt);
  gemAiConfig.ui.placeholder = "Enter text to translate";

  return GemAI(gemAiConfig);
}

import { getPreferenceValues } from "@raycast/api";
import { buildGemAIConfig } from "./core/buildGemAIConfig";
import makeScreenshot from "./core/makeScreenshot";
import { RaycastProps } from "./core/types";

export default async function screenshotToTranslate(props: RaycastProps) {
  const prefs = getPreferenceValues();
  const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
  const secondLang = prefs.secondaryLanguage.trim().toUpperCase();
  const fallbackPrompt =
    `Determine the language of the upcoming text. By default it's ${secondLang}. If ${pimaryLang}, return it unchanged. ` +
    `If not ${pimaryLang}, translate it to ${pimaryLang} with absolute accuracy and natural phrasing. ` +
    `Preserve the original meaning, tone, formatting, special characters, and letter case. ` +
    `Adapt punctuation to ${pimaryLang} norms and keep proper nouns/brands in original script unless a common ${pimaryLang} version exists. ` +
    `ALWAYS return ONLY the processed text.`;

  const gemAiConfig = buildGemAIConfig("Screenshot -> Translate", props, fallbackPrompt);

  return await makeScreenshot(props, true, gemAiConfig);
}

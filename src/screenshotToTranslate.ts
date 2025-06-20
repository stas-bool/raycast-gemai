import { getPreferenceValues } from "@raycast/api";
import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_SCR_TRANSLATE, getCmd } from "./core/commands";
import makeScreenshot from "./core/makeScreenshot";
import { RaycastProps } from "./core/types";

export default async function ScreenshotToTranslate(props: RaycastProps) {
  const prefs = getPreferenceValues();
  const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
  const secondLang = prefs.secondaryLanguage.trim().toUpperCase();
  const fallbackPrompt =
    `Determine the language of the upcoming text. By default it's ${secondLang}. If ${pimaryLang}, return it unchanged. ` +
    `If not ${pimaryLang}, translate it to ${pimaryLang} with absolute accuracy and natural phrasing. ` +
    `Preserve the original meaning, tone, formatting, special characters, and letter case. ` +
    `Adapt punctuation to ${pimaryLang} norms and keep proper nouns/brands in original script unless a common ${pimaryLang} version exists. ` +
    `ALWAYS return ONLY the processed text.`;

  const aiConfig = buildAIConfig(getCmd(CMD_SCR_TRANSLATE).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_SCR_TRANSLATE).ui_placeholder || "Translate text in screenshot...";

  return await makeScreenshot(props, true, aiConfig);
}

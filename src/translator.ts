import { getPreferenceValues } from "@raycast/api";
import { buildAIConfig } from "./core/buildAIConfig";
import { CMD_TRANSLATOR, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Translator(props: RaycastProps) {
  const prefs = getPreferenceValues();
  const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
  const secondLang = prefs.secondaryLanguage.trim().toUpperCase();
  const fallbackPrompt = `Please translate the text (${pimaryLang} <> ${secondLang}),
ensuring the meaning is precisely preserved and the result sounds natural and clear to a native speaker.
To accomplish this, you may reorder words, but ONLY within their original sentence. Please do not distort or simplify the content.
If the following text is in ${pimaryLang} then translate it to ${secondLang}, otherwise translate following text to ${pimaryLang}.
ALSWAYS ONLY return the translated text and nothing else.`;

  const aiConfig = buildAIConfig(getCmd(CMD_TRANSLATOR).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_TRANSLATOR).ui_placeholder || "Enter text to translate...";

  return GemAI(aiConfig);
}

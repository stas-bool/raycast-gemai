import { getPreferenceValues } from "@raycast/api";
import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_GRAMMAR, getCmd } from "./core/commands";
import GemAI from "./core/gemai";
import { RaycastProps } from "./core/types";

export default function Grammar(props: RaycastProps) {
  const prefs = getPreferenceValues();
  const pimaryLang = prefs.primaryLanguage.trim().toUpperCase();
  const secondLang = prefs.secondaryLanguage.trim().toUpperCase();
  const fallbackPrompt =
    `You are a ${pimaryLang} and ${secondLang} proofreader. ` +
    "Make the text flawless for a native speaker: correct grammar, spelling, punctuation, and capitalization. " +
    "You can change words/word order in the sentence for better readability by a native speaker, " +
    "but without distorting the meaning or completely rephrasing, while preserving the style and structure. " +
    "ALWAYS return ONLY the corrected text or the original if it is perfect.";

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_GRAMMAR).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_GRAMMAR).ui_placeholder;

  return GemAI(gemAiConfig);
}

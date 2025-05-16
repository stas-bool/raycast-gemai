import { buildGemAIConfig } from "./core/buildGemAIConfig";
import { CMD_SCR_EXPLAIN, getCmd } from "./core/commands";
import makeScreenshot from "./core/makeScreenshot";
import { RaycastProps } from "./core/types";

export default async function ScreenshotToExplain(props: RaycastProps) {
  const fallbackPrompt =
    "Process the upcoming image based on the user's text. " +
    "Execute any instructions provided; if none, describe the image in detail. " +
    "If you use lists, they should be single-level and non-nested. " +
    "Be ready to answer any follow-up questions." +
    "Respond ONLY with the direct result.";

  const gemAiConfig = buildGemAIConfig(getCmd(CMD_SCR_EXPLAIN).id, props, fallbackPrompt);
  gemAiConfig.ui.placeholder = getCmd(CMD_SCR_EXPLAIN).ui_placeholder;
  gemAiConfig.ui.useSelected = false;

  return await makeScreenshot(props, true, gemAiConfig);
}

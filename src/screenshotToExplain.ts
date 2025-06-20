import { buildAIConfig } from "./core/buildAIConfig";
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

  const aiConfig = buildAIConfig(getCmd(CMD_SCR_EXPLAIN).id, props, fallbackPrompt);
  aiConfig.ui.placeholder = getCmd(CMD_SCR_EXPLAIN).ui_placeholder || "Describe the screenshot...";
  aiConfig.ui.useSelected = false;

  return await makeScreenshot(props, true, aiConfig);
}

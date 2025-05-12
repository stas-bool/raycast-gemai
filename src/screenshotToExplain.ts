import { buildGemAIConfig } from "./core/buildGemAIConfig";
import makeScreenshot from "./core/makeScreenshot";
import { RaycastProps } from "./core/types";

export default async function ScreenshotToExplain(props: RaycastProps) {
  const fallbackPrompt =
    "Process the upcoming image based on the user's text. " +
    "Execute any instructions provided; if none, describe the image in detail. " +
    "If you use lists, they should be single-level and non-nested. " +
    "Be ready to answer any follow-up questions." +
    "Respond ONLY with the direct result.";

  const gemAiConfig = buildGemAIConfig("ScreenshotToExplain", props, fallbackPrompt);
  gemAiConfig.ui.placeholder = "Additional instructions if any";
  gemAiConfig.ui.useSelected = false;

  return await makeScreenshot(props, true, gemAiConfig);
}

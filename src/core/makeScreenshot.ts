import { closeMainWindow, environment, launchCommand, LaunchType, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import * as fs from "fs";
import * as util from "util";
import { GemAIConfig, RaycastProps } from "./types";

export default async function makeScreenshot(props: RaycastProps, isSelecting: boolean, gemAiConfig: GemAIConfig) {
  await closeMainWindow();

  const execPromise = util.promisify(exec);
  const screenshotPath = `${environment.assetsPath}/screenshot.png`;
  const screencaptureCmd = `/usr/sbin/screencapture ${isSelecting ? "-s" : ""} ${screenshotPath}`;

  try {
    await execPromise(screencaptureCmd);
    if (!fs.existsSync(screenshotPath)) {
      throw new Error("Screenshot file was not created");
    }
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to get screenshot",
      message: error.message,
    });
    return;
  }

  console.debug(`Screenshot captured at ${screenshotPath}`);

  try {
    await launchCommand({
      name: "askQuestion",
      type: LaunchType.UserInitiated,
      context: {
        props: props,
        gemAiConfig: gemAiConfig,
        attachmentFile: screenshotPath,
      },
    });
  } catch (error) {
    console.error(error.message);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to launch askQuestion command",
      message: error.message,
    });
  }
}

import { Detail, getSelectedText, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { createAIProvider } from "./core/aiProvider";
import { buildAIConfig } from "./core/buildAIConfig";
import { getCmd, CMD_COUNT_TOKENS } from "./core/commands";

export default function CountTokens() {
  const [markdown, setMarkdown] = useState<string>("Counting tokens...");

  useEffect(() => {
    (async () => {
      try {
        const text = await getSelectedText();
        if (!text) {
          setMarkdown("No text selected.");
          return;
        }

        // Build AI configuration using universal system
        const config = buildAIConfig(getCmd(CMD_COUNT_TOKENS).id, {
          arguments: { query: text },
          fallbackText: text,
          launchType: "immediate"
        });

        // Create appropriate provider based on configuration
        const provider = createAIProvider(config);

        // Count tokens using the provider's method
        const tokenCount = await provider.countTokens(config, text);

        setMarkdown(`**Token count:** ${tokenCount}\n\n**Model:** ${config.model.modelNameUser}\n\n**Provider:** ${config.provider.toUpperCase()}`);
      } catch (error: any) {
        console.error("Token counting error:", error);
        console.error("Error stack:", error.stack);
        
        await showToast({ 
          style: Toast.Style.Failure, 
          title: "Error counting tokens", 
          message: error.message || "Unknown error"
        });
        
        setMarkdown(`**Failed to count tokens**\n\n**Error:** ${error.message || "Unknown error"}\n\n**Details:** ${error.stack ? error.stack.split('\n')[0] : "No details"}`);
      }
    })();
  }, []);

  return <Detail markdown={markdown} />;
}

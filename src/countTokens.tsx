import { useEffect, useState } from "react";
import { Detail, getSelectedText, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { GoogleGenAI } from "@google/genai";

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
        const prefs = getPreferenceValues();
        const ai = new GoogleGenAI({ apiKey: prefs.geminiApiKey.trim() });
        const result = await ai.models.countTokens({
          model: prefs.defaultModel,
          contents: [text],
        });
        setMarkdown(`**Token count:** ${result.totalTokens}`);
      } catch (error: any) {
        await showToast({ style: Toast.Style.Failure, title: "Error counting tokens", message: error.message });
        setMarkdown("Failed to count tokens.");
      }
    })();
  }, []);

  return <Detail markdown={markdown} />;
}

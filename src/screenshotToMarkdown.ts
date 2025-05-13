import { buildGemAIConfig } from "./core/buildGemAIConfig";
import makeScreenshot from "./core/makeScreenshot";
import { RaycastProps } from "./core/types";

export default async function c(props: RaycastProps) {
  const fallbackPrompt = `You are provided with an image (screenshot).
Your task:
1.  Analyze the image and extract all visible text.
2.  Convert the extracted text to Github Flavored Markdown (GFM).
3.  Precisely replicate the original text's structure and formatting using GFM. This includes, but is not limited to:
    *   Headings (e.g., # H1, ## H2)
    *   Lists (e.g., 1. Item, - Item)
    *   Emphasis (e.g., **bold**, *italic*, ~~strike~~)
    *   Code blocks (\`\`\`language ... \`\`\` or \`\`\` ... \`\`\` if language is apparent, otherwise just \`\`\` ... \`\`\`)
    *   Inline code (\`code\`)
    *   Blockquotes (e.g., > quote)
    *   Horizontal rules (e.g., --- on a new line)
    *   Links (if text is a URL, format as <URL> or [link text](URL) if context allows)
    *   Tables (reproduce using GFM table syntax: | Header 1 | Header 2 | \\n |---|---| \\n | Cell 1 | Cell 2 |).
4.  Ensure all text is transferred accurately.
5.  Output *only* the resulting GFM. Do not add any introductions, explanations, or comments before or after the Markdown code.
`;

  const gemAiConfig = buildGemAIConfig("Screenshot -> Markdown", props, fallbackPrompt);
  gemAiConfig.ui.placeholder = "Additional instructions if any";
  gemAiConfig.ui.useSelected = false;

  return await makeScreenshot(props, true, gemAiConfig);
}

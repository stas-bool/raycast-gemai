# GemAI (WIP)

GemAI is a Raycast extension designed to supercharge your productivity by integrating Google's Gemini AI models directly into your workflow. Perform a
wide range of text and image processing tasks, from quick translations and grammar checks to sophisticated image analysis and custom prompt execution,
all without leaving Raycast. It operates on a "Bring Your Own Key" (BYOK) model, giving you full control over your API usage.

## Key Features

- **Boost Office Productivity:** Streamline common text-based and image-related tasks directly within Raycast, minimizing context switching and saving
  valuable time.
- **Leverage Powerful AI with Control:** Utilize Google's cutting-edge Gemini models (including 2.0 and 2.5 versions) with a BYOK approach for your
  Google Gemini API Key.
- **Unprecedented Prompt Customization:** A standout feature allows you to store and manage your system prompts as local Markdown (`.md`) files. Edit
  them in your favorite editor (like Obsidian), version control them with Git, and ensure perfect synchronization across your setup.
- **Comprehensive Task Toolkit:** Access a wide array of commands for text manipulation (translation, grammar correction, summarization, rephrasing,
  style adjustments) and image understanding (screenshot to text/Markdown, image explanation).
- **Seamless Raycast Integration:** Works fluidly with selected text or via intuitive Raycast command interfaces, making AI assistance readily
  available.

## Commands

GemAI offers a suite of commands to enhance your daily tasks. Most commands can work with currently selected text or allow you to input
text/instructions directly.

- **Translator:** Translate selected text between your primary and secondary languages.
    - *Input:* Selected text or text provided in the command.
- **Fix grammar & spelling:** Correct grammar, spelling, punctuation, and capitalization for selected text.
    - *Input:* Selected text.
- **Summarize it:** Generate a concise summary of the selected text.
    - *Input:* Selected text.
- **Explain it:** Get an explanation for the selected text or a term you provide.
    - *Input:* Selected text or text/term provided in the command.
- **Friendly text maker:** Rewrite selected text to be warmer and more friendly.
    - *Input:* Selected text.
- **Professional text maker:** Make selected text more formal and professional.
    - *Input:* Selected text.
- **Prompt Generator:** Create or improve an LLM prompt based on your ideas.
    - *Input:* Text describing your prompt idea.
- **Make text shorter:** Significantly shorten and make selected text more concise.
    - *Input:* Selected text.
- **Make text longer:** Expand on the selected text, adding relevant details.
    - *Input:* Selected text.
- **Rephrase it:** Rewrite the provided text using different phrasing while maintaining the original meaning.
    - *Input:* Selected text.
- **Ask GemAI any question:** Ask any question on any topic, optionally attaching an image or file for context.
    - *Input:* Your question; can optionally attach a file/image.
- **Screenshot -> Markdown:** Capture a screenshot and convert its textual content into Github Flavored Markdown.
    - *Input:* Takes a screenshot (allows selection). You can provide additional instructions.
- **Screenshot -> Explain:** Capture a screenshot, analyze it, and answer your question about it or describe it.
    - *Input:* Takes a screenshot (allows selection). You can provide additional instructions or questions.

## Core Idea: Customizable Prompts via Markdown

One of GemAI's most powerful features is the ability to define system prompts for each command (or use a fallback) using local Markdown files.

- **How it works:** In the extension preferences, you can specify a `Prompt Directory` (e.g., `~/Documents/Prompts/Raycast`). For each command, GemAI
  will look for a corresponding Markdown file (e.g., `Translator.md`, `Grammar.md`) in this directory.
- **Benefits:**
    - **Easy Editing:** Use your favorite Markdown editor (like Obsidian, VS Code, etc.) to craft and refine your prompts.
    - **Version Control:** Store your prompts in a Git repository for version history, collaboration, and easy backup/sync.
    - **Personalization:** Tailor the AI's behavior precisely to your needs for each specific task.
    - **Consistency:** Ensure consistent AI responses by using well-defined and versioned prompts.
- If a specific Markdown file for a command is not found, a sensible fallback prompt embedded in the extension will be used. The UI will indicate if a
  custom prompt is active (e.g., with a 💭 icon next to the model name).

## Tech Stack

- TypeScript
- Raycast API
- Google Gemini API (`@google/genai` SDK)
- Node.js (for file system operations and utility scripts)

## Prerequisites

- Raycast application installed.
- A Google Gemini API Key. You can obtain one from Google AI Studio.

## Installation & Setup

1. Install the GemAI extension from the Raycast Store.
2. After installation, you will need to configure the extension:
    - Open Raycast Preferences (⌘,).
    - Navigate to Extensions > GemAI.
    - **Gemini API Key:** Enter your Google Gemini API Key. This is required.
    - **Default Model:** Choose a default Gemini model to use. This can be overridden per command.
    - **Custom Model (Optional):** If you use a fine-tuned or specific model not in the list, enter its ID here.
    - **Primary Language:** Set your default language for AI responses.
    - **Prompt Directory (Recommended):** Specify the full path to a local directory where you will store your custom `.md` prompt files (e.g.,
      `~/Documents/MyGemAIPrompts`). See "Customizable Prompts via Markdown" for details.

## Configuration

GemAI offers several preferences to customize its behavior:

### Global Preferences

- **Gemini API Key:** (Required) Your API key for accessing Google Gemini models.
- **Default Model:** The Gemini model used by default for all commands (e.g., `gemini-2.5-flash-preview-04-17`).
- **Custom Model:** (Optional) Specify a custom Gemini model ID if you're using one not listed in the default options. This overrides the "Default
  Model".
- **Primary Language:** The main language you expect responses in (e.g., "English"). Some commands use this to tailor their prompts.
- **Prompt Directory:** The absolute path to the folder where your custom Markdown prompt files are stored.

### Per-Command Preferences

Each command in GemAI also has its own preferences, typically:

- **Model for the command:** Choose a specific Gemini model for this command, or select "Default" to use the globally configured model.
- **Markdown file with system prompt:** The name of the `.md` file (e.g., `Translator.md`) within your `Prompt Directory` to be used as the system
  prompt for this command. If left blank or the file doesn't exist, a default internal prompt is used.
- Some commands (like **Translator** and **Fix grammar & spelling**) may also have a **Secondary Language** preference.

## Usage

1. **Activate Raycast:** Use your Raycast hotkey.
2. **Type Command Name:** Start typing the name of a GemAI command (e.g., "Translate", "Summarize it", "Ask GemAI").
3. **Provide Input:**
    - **Selected Text:** If a command supports it (most text-based commands do), it will automatically use any text you have selected on your screen.
    - **Direct Input:** If no text is selected, or if the command requires direct input (like "Ask GemAI" or "Prompt Generator"), an input field will
      appear. Type your query or text.
    - **Arguments:** Some commands might take arguments directly in the Raycast input line.
    - **File Attachments:** The "Ask GemAI" command allows attaching a file through its form interface.
    - **Screenshots:** "Screenshot -> Markdown" and "Screenshot -> Explain" commands will trigger a screenshot capture (allowing area selection).
4. **Get Results:** The AI's response will be displayed in the Raycast view. You can usually copy the response or paste it directly.

## License

This project is licensed under the MIT License.

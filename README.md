# GemAI - Intelligent Raycast Assistant with Gemini AI

**GemAI** is a powerful Raycast extension that brings Google's Gemini AI directly into your workflow. Perform a wide array of tasks – from drafting emails and summarizing articles to translating languages and analyzing screenshots – all without leaving Raycast. GemAI is designed to be your versatile and quick assistant for numerous office and daily routine tasks.

## ✨ Key Features

GemAI offers a comprehensive suite of tools, leveraging the capabilities of Gemini AI:

**💬 Advanced AI Chat:**
- **Persistent Chat Sessions:** Engage in ongoing conversations with AI. Create, name, switch, and delete chat sessions.
- **Per-Chat Configuration:** Customize the AI model and system instructions for each chat session.
- **Streaming Responses:** Get real-time feedback as the AI generates its response.
- **Contextual History:** The AI remembers previous messages within a session for coherent dialogue.

**📝 Powerful Text Tools:**
- **Ask AI:** Get answers to your questions on any topic.
- **Summarize It:** Condense long texts into concise summaries, capturing main ideas, facts, and conclusions.
- **Explain It:** Understand complex words, sentences, or concepts with clear explanations.
- **Rephrase It:** Rewrite text using different words and sentence structures while preserving the original meaning, tone, and style.
- **Make It Longer/Shorter:** Expand on brief text or make lengthy content more concise.
- **Fix Grammar:** Correct grammar, spelling, punctuation, and capitalization for flawless text.
- **Change Tone:**
    - **Friendlier:** Make your text warmer, more positive, and conversational.
    - **Professional:** Rephrase text with a formal, business-oriented tone.
- **Translate:** Translate text between your primary and secondary languages, or auto-detect and translate.

**🖼️ Screenshot Interaction (Powered by Gemini Vision):**
- **Screenshot to Markdown:** Capture a screenshot and convert its content into well-formatted Github Flavored Markdown (GFM).
- **Screenshot to Explain:** Take a screenshot and have the AI analyze its content, describe it, or follow your instructions regarding the image.
- **Screenshot to Translate:** Capture a screenshot and translate any text within it.

**🛠️ Productivity & Customization:**
- **Prompt Builder:** Create new LLM prompts or improve existing ones based on your ideas, following best practices.
- **Command History:** Access a detailed history of your interactions with GemAI, including queries, responses, and stats.
- **Usage Statistics:** Get insights into your GemAI usage, including:
    - Number of requests, total cost, token usage.
    - Breakdowns by time periods (hour, day, week, month).
    - Detailed stats per command and per AI model used.
- **Highly Configurable:**
    - **Gemini API Key:** Securely store your API key.
    - **Model Selection:** Choose from various Gemini models globally, per-command, or even per-chat session (e.g., Flash for speed, Pro for complexity).
    - **Custom System Prompts:** Define your own system prompts for each command by placing text files in a specified directory, tailoring the AI's behavior to your exact needs.
    - **Language Preferences:** Set primary and secondary languages for translation and other language-sensitive commands.
    - **Temperature Control:** Adjust the AI's creativity/predictability.

## 🚀 Installation

1. **Raycast:** Ensure you have Raycast installed on your macOS.
2. **GemAI Extension:**
    - **Recommended:** Install GemAI from the [Raycast Store](https://www.raycast.com/store) (Link will be active once published).
    - **Manual (if applicable):** (Provide instructions if manual installation is an option, e.g., cloning the repo and building).
3. **API Key Configuration:**
    - You will need a **Google Gemini API Key**. You can typically obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey) or via the Google Cloud Console.
    - Open Raycast Preferences -> Extensions -> GemAI.
    - Enter your Gemini API Key in the designated field.

## ⚙️ Configuration

GemAI offers several preferences to tailor its behavior, accessible via Raycast Preferences -> Extensions -> GemAI:

- **Gemini API Key (Required):** Your API key for accessing Gemini models.
- **Default Model:** Select the default Gemini model to be used for commands.
- **Command-Specific Model:** Many commands allow you to override the default model with a specific one.
- **Custom Prompt Directory & File:** Specify a directory and a default filename (e.g., `system.txt`) for custom system prompts. GemAI will look for `your_command_id.txt` or `system.txt` in this directory to override built-in prompts.
- **Primary Language:** Your main language for interactions and some command defaults.
- **Secondary Language:** Used for translation commands.
- **Temperature:** Control the randomness/creativity of the AI's responses.
- Other model parameters like Top-P, Top-K may also be available.

## 📋 Available Commands

Here's a list of the primary commands provided by GemAI (you can find these by searching in Raycast):

| Command Name                 | Description                                                                          | Default Input      |
| ---------------------------- | ------------------------------------------------------------------------------------ | ------------------ |
| **Ask AI**                   | Ask AI any question on any topic.                                                    | Typed/Selected Text |
| **Chat with AI**             | Have a persistent, configurable conversation with GemAI.                             | Typed Text         |
| **Explain It**               | Explain selected text or a concept you type.                                         | Selected Text      |
| **Friend Text Maker**        | Make text warmer and friendlier.                                                     | Selected Text      |
| **Fix Grammar**              | Correct grammar, spelling, and punctuation.                                          | Selected Text      |
| **History - GemAI**          | Show your interaction history with GemAI.                                            | N/A                |
| **Longer Text Maker**        | Make selected text significantly longer.                                             | Selected Text      |
| **Professional Text Maker**  | Make text formal and professional.                                                   | Selected Text      |
| **Prompt Builder**           | Create or improve your LLM prompts.                                                  | Typed Text         |
| **Rephrase It**              | Rewrite text using different phrasing while maintaining meaning.                     | Selected Text      |
| **Screenshot -> Explain**    | Take a screenshot, analyze it, and answer your question or follow instructions.      | Screenshot         |
| **Screenshot -> Markdown**   | Take a screenshot and convert its content to Markdown.                               | Screenshot         |
| **Screenshot -> Translate**  | Take a screenshot and translate text within it.                                      | Screenshot         |
| **Shorter Text Maker**       | Make selected text significantly shorter and more concise.                           | Selected Text      |
| **GemAI - Stats**            | Show usage insights, statistics, and costs for your GemAI interactions.              | N/A                |
| **Summarize It**             | Summarize selected text.                                                             | Selected Text      |
| **Translator**               | Translate selected text between your configured languages.                             | Selected Text      |

*Note: "Selected Text" means the command will use the text you've highlighted in any application. If no text is selected, many commands will allow you to type input directly in Raycast.*

## 💡 Usage Examples

- **Draft an email:** Select a few bullet points, run "Professional Text Maker," then refine.
- **Understand code:** Select a code snippet, run "Explain It."
- **Quick summary:** Select a news article, run "Summarize It."
- **Brainstorm ideas:** Use "Chat with AI" to explore concepts.
- **Document UI:** Use "Screenshot -> Markdown" to quickly grab UI elements for documentation.
- **Improve your writing:** Paste your text into "Fix Grammar" or "Rephrase It."

## 🤝 Contributing

Contributions are welcome! Whether it's bug reports, feature requests, or code contributions, please feel free to:

1. **Open an Issue:** For bugs, feature suggestions, or discussions.
2. **Fork the Repository:** Create your own copy to work on.
3. **Create a Pull Request:** Submit your changes for review.

Please adhere to standard coding practices and ensure your contributions are well-tested.

(Consider adding a `CONTRIBUTING.md` file for more detailed guidelines.)

## 📜 License

This project is licensed under the **[MIT License](LICENSE)**.

---

Thank you for using GemAI! We hope it enhances your productivity and makes your daily tasks easier.

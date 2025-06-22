# Raycast GemAI - Universal AI Assistant

**Raycast GemAI** is a powerful Raycast extension that brings both **Google Gemini** and **OpenAI GPT** models directly into your workflow. Perform text processing, complex reasoning, image analysis, and translation – all without leaving Raycast.

> 🇷🇺 **Русская версия:** [README_RUS.md](README_RUS.md)
>
> 🇨🇳 **中文版本:** [README_CN.md](README_CN.md)

## ✨ Key Features

- **🤖 Universal AI Support:** Seamlessly switch between Google Gemini and OpenAI models with automatic provider detection
- **🧠 Advanced Reasoning:** Full support for OpenAI's o1-preview and o1-mini with enhanced thinking capabilities
- **🖼️ Vision Analysis:** Image processing with GPT-4o and Gemini Vision, automatic model switching for optimal results
- **💬 Chat Room:** Interactive conversations with persistent context memory
- **📝 Text Tools:** Comprehensive suite for writing, editing, translation, and summarization
- **📊 Usage Analytics:** Real-time token tracking and accurate cost calculation
- **🎨 Custom Prompts:** Use your own Markdown files to customize AI behavior per command

## 🤖 Supported Models & Pricing

### OpenAI Models
| Model | Type | Input/Output Cost (per 1M tokens) | Best For |
|-------|------|-----------------------------------|----------|
| **GPT-4o** | Vision + Text | $2.50 / $10.00 | General tasks, image analysis |
| **GPT-4o-mini** | Vision + Text | $0.15 / $0.60 | Fast, cost-effective tasks |
| **o1-preview** | Reasoning | $15.00 / $60.00 | Complex problem solving |
| **o1-mini** | Reasoning | $3.00 / $12.00 | Efficient reasoning tasks |

### Google Gemini Models
| Model | Type | Input/Output Cost (per 1M tokens) | Best For |
|-------|------|-----------------------------------|----------|
| **Gemini 2.0 Flash-Lite** | Vision + Text | $0.075 / $0.30 | Fast, cost-effective tasks |
| **Gemini 2.0 Flash** | Vision + Text | $0.10 / $0.40 | Balanced performance |
| **Gemini 2.5 Flash** | Vision + Text | $0.15 / $0.60 | Enhanced performance |
| **Gemini 2.5 Flash Thinking** | Vision + Text | $0.15 / $0.60 + $3.50 thinking | Advanced reasoning |
| **Gemini 2.5 Pro** | Vision + Text | $1.25 / $10.00 | Complex reasoning and analysis |

## 📋 Available Commands

| Command | Description | Input Type | AI Provider |
|---------|-------------|------------|-------------|
| **Ask AI** | Ask questions using any available model | Text/Selection | Universal |
| **Chat Room** | Interactive chat with persistent context | Text Input | Universal |
| **Explain It** | Detailed explanations with context | Selection | Universal |
| **Summarize It** | Intelligent text summarization | Selection | Universal |
| **Rephrase It** | Rewrite while preserving meaning | Selection | Universal |
| **Fix Grammar** | Grammar and style correction | Selection | Universal |
| **Professional/Friendly Tone** | Transform text tone | Selection | Universal |
| **Make Longer/Shorter** | Expand or condense content | Selection | Universal |
| **Translate** | Multi-language translation | Selection | Universal |
| **Count Tokens** | Estimate costs and optimize usage | Text/Selection | Universal |
| **Screenshot → Markdown** | Convert images to formatted Markdown | Screenshot | Vision Models |
| **Screenshot → Explain** | Analyze and describe images | Screenshot | Vision Models |
| **Screenshot → Translate** | Extract and translate image text | Screenshot | Vision Models |
| **Usage Statistics** | Detailed analytics and costs | - | - |

## 🚀 Quick Start

### Installation
1. **Raycast Store (Recommended):** Search for "GemAI" in Raycast Store
2. **Local Development:**
   ```bash
   git clone https://github.com/smetdenis/raycast-gemai.git
   cd raycast-gemai
   npm install && npm run build
   ```

### Configuration
Access settings via **Raycast Preferences → Extensions → GemAI**:

**Required:**
- **Gemini API Key:** Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **OpenAI API Key:** Get from [OpenAI Platform](https://platform.openai.com/api-keys)

**Optional:**
- **Default Model:** Choose preferred model for all commands
- **Custom Models:** Add OpenAI-compatible models (Azure, local deployments)
- **Temperature:** Control AI creativity (0.0 = focused, 1.0 = creative)
- **Custom Prompts:** Point to directory with custom system prompts
- **Languages:** Set primary/secondary languages for translation

## 🎨 Custom System Prompts

Create custom Markdown files to override built-in prompts:

1. **Create prompts directory:** `mkdir ~/Documents/Prompts/Raycast`
2. **Create prompt files** (e.g., `AskQuestion.md`):
   ```markdown
   # Custom Ask AI Prompt
   
   You are a specialized technical consultant with expertise in software development.
   Always provide practical, actionable advice with code examples when relevant.
   ```
3. **Configure in Raycast:** Set **Prompt Directory** and specify custom file names per command

**Available prompt files:** `AskQuestion.md`, `ChatRoom.md`, `Explainer.md`, `Grammar.md`, `Professional.md`, `Friend.md`, `Translator.md`, `Screenshot-Explain.md`, `Screenshot-Markdown.md`

## 💡 Usage Examples

```bash
# Text Processing
Select text → Fix Grammar: "there dog is running" → "Their dog is running"
Select text → Professional: "hey, can u help?" → "Could you please assist me?"

# Advanced Reasoning (o1-series)
Ask AI → "Solve this differential equation step by step..."

# Vision & Screenshots
Take screenshot → Screenshot → Markdown: Converts UI to formatted Markdown
Take screenshot → Screenshot → Explain: "What's happening in this diagram?"

# Smart Model Switching
o1-mini + Screenshot → Auto-switches to GPT-4o for image processing
```

## 🔧 Development

### Key Features
- **Universal Architecture:** Single codebase supporting multiple AI providers
- **Reasoning Model Support:** Full o1-series compatibility
- **Vision Auto-switching:** Intelligent model selection for multimodal tasks
- **Real-time Analytics:** Accurate token counting and cost calculation

### Building
```bash
npm install     # Install dependencies
npm run dev     # Development with watch
npm run build   # Production build
```

## 🤝 Contributing

1. Fork the repository
2. Clone locally: `git clone https://github.com/smetdenis/raycast-gemai.git`
3. Make changes following TypeScript strict mode and backward compatibility
4. Test with both Gemini and OpenAI models
5. Submit pull request with detailed description

## 🔒 Privacy & License

- **Privacy:** API keys stored securely in Raycast, no data stored or transmitted to third parties
- **License:** [MIT License](LICENSE)
- **Policies:** Subject to Google Gemini and OpenAI privacy policies

---

**Raycast GemAI** - Your universal AI assistant, powered by the best models from Google and OpenAI.

For support: [GitHub Issues](https://github.com/smetdenis/raycast-gemai/issues)

# Raycast GemAI - Universal AI Assistant with Gemini & OpenAI Support

**Raycast GemAI** is a powerful Raycast extension that brings both **Google Gemini** and **OpenAI GPT** models directly into your workflow. Perform a wide array of tasks – from drafting emails and complex reasoning to analyzing screenshots and translating languages – all without leaving Raycast. With universal AI provider support, advanced reasoning capabilities, and intelligent model switching, GemAI is your versatile assistant for any task.

## ✨ Key Features

### 🤖 Universal AI Provider Support
- **Dual Provider Architecture:** Seamlessly switch between Google Gemini and OpenAI models
- **Automatic Provider Detection:** Models are automatically routed to the correct AI provider
- **Custom Model Support:** Add your own OpenAI-compatible models (Azure, local deployments, etc.)
- **Smart Model Switching:** Automatic fallback to vision-capable models when needed

### 🧠 Advanced AI Capabilities
- **Reasoning Models:** Full support for OpenAI's o1-preview and o1-mini with enhanced thinking capabilities
- **Vision Processing:** Image analysis with GPT-4o and Gemini Vision models
- **Multimodal Support:** Handle text, images, and documents across all supported providers
- **Real-time Token Tracking:** Accurate usage statistics and cost calculation

### 📝 Comprehensive Text Tools
- **Ask AI:** Get answers using the most advanced models (GPT-4o, o1-series, Gemini Pro)
- **Summarize It:** Condense long texts with intelligent summarization
- **Explain It:** Understand complex concepts with detailed explanations
- **Rephrase It:** Rewrite text while preserving meaning and style
- **Make It Longer/Shorter:** Expand or condense content as needed
- **Fix Grammar:** Perfect grammar, spelling, and punctuation
- **Change Tone:** Transform text to be friendlier or more professional
- **Translate:** Multi-language translation with auto-detection

### 🖼️ Screenshot & Vision Analysis
- **Screenshot to Markdown:** Convert screenshots to perfectly formatted GitHub Flavored Markdown
- **Screenshot Analysis:** Comprehensive image analysis and Q&A with vision models
- **Screenshot Translation:** Extract and translate text from any image
- **Smart Model Selection:** Automatically switches to GPT-4o for vision tasks when using reasoning models

### 🛠️ Advanced Configuration
- **Multiple AI Providers:** Configure both Gemini and OpenAI API keys
- **Model Selection:** Choose from 15+ models including GPT-4o, o1-series, and Gemini models
- **Custom System Prompts:** Tailor AI behavior with custom prompts per command
- **Language Preferences:** Set primary/secondary languages for translation
- **Temperature Control:** Fine-tune creativity and randomness
- **Usage Analytics:** Detailed statistics with cost tracking and token usage

## 🤖 Supported AI Models

### OpenAI Models
| Model | Type | Input Cost | Output Cost | Best For |
|-------|------|------------|-------------|----------|
| **GPT-4o** | Vision + Text | $2.50/1M | $10.00/1M | General tasks, image analysis |
| **GPT-4o-mini** | Vision + Text | $0.15/1M | $0.60/1M | Fast, cost-effective tasks |
| **o1-preview** | Reasoning | $15.00/1M | $60.00/1M | Complex problem solving |
| **o1-mini** | Reasoning | $3.00/1M | $12.00/1M | Efficient reasoning tasks |

### Google Gemini Models
| Model | Type | Input Cost | Output Cost | Best For |
|-------|------|------------|-------------|----------|
| **Gemini 2.0 Flash** | Vision + Text | $0.10/1M | $0.40/1M | Fast, multimodal tasks |
| **Gemini 2.5 Flash** | Vision + Text | $0.15/1M | $0.60/1M | Enhanced performance |
| **Gemini 2.5 Pro** | Vision + Text | $1.25/1M | $10.00/1M | Complex reasoning and analysis |

*All costs are per 1 million tokens. Reasoning models include additional thinking token costs.*

## 🚀 Installation

### Option 1: Raycast Store (Recommended)
1. Install Raycast on your macOS
2. Open Raycast Store and search for "GemAI"
3. Click Install and follow the setup instructions

### Option 2: Local Development Installation
1. **Prerequisites:**
   ```bash
   # Ensure you have Node.js 18+ installed
   node --version
   npm --version
   ```

2. **Clone and Setup:**
   ```bash
   git clone https://github.com/your-username/raycast-gemai.git
   cd raycast-gemai
   npm install
   ```

3. **Build the Extension:**
   ```bash
   npm run build
   ```

4. **Install in Raycast:**
   - Open Raycast Preferences
   - Go to Extensions → Add Extension
   - Select the built extension folder (`dist/`)
   - Configure your API keys

## ⚙️ Configuration

Access all settings via **Raycast Preferences → Extensions → GemAI**:

### Required Settings
- **Gemini API Key:** Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **OpenAI API Key:** Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Model Configuration
- **Default Model:** Choose your preferred model for all commands
- **Command-Specific Models:** Override default model per command type
- **Custom Models:** Add OpenAI-compatible models with custom names

### Advanced Settings
- **OpenAI Base URL:** Configure custom endpoints (Azure, local deployments)
- **Temperature:** Control AI creativity (0.0 = focused, 1.0 = creative)
- **Custom Prompts:** Point to directory with custom system prompts
- **Languages:** Set primary/secondary languages for translation

### Cost Management
- **Usage Tracking:** Monitor token usage and costs across all models
- **Budget Alerts:** Set spending limits and usage notifications
- **Model Optimization:** Recommendations for cost-effective model selection

## 📋 Available Commands

| Command | AI Provider | Description | Input Type |
|---------|-------------|-------------|------------|
| **Ask AI** | Universal | Ask questions using any available model | Text/Selection |
| **Explain It** | Universal | Detailed explanations with context | Selection |
| **Summarize It** | Universal | Intelligent text summarization | Selection |
| **Rephrase It** | Universal | Rewrite while preserving meaning | Selection |
| **Fix Grammar** | Universal | Grammar and style correction | Selection |
| **Professional Tone** | Universal | Formal business writing | Selection |
| **Friendly Tone** | Universal | Casual, warm communication | Selection |
| **Make Longer** | Universal | Expand and elaborate content | Selection |
| **Make Shorter** | Universal | Concise, focused versions | Selection |
| **Translate** | Universal | Multi-language translation | Selection |
| **Prompt Builder** | Universal | Create better AI prompts | Text Input |
| **Screenshot → Markdown** | Vision Models | Convert images to Markdown | Screenshot |
| **Screenshot → Explain** | Vision Models | Analyze and describe images | Screenshot |
| **Screenshot → Translate** | Vision Models | Extract and translate image text | Screenshot |
| **Usage Statistics** | - | Detailed analytics and costs | - |
| **Command History** | - | Previous interactions and results | - |

## 💡 Usage Examples

### Text Processing
```bash
# Select any text and run:
→ Fix Grammar: "there dog is running" → "Their dog is running"
→ Professional: "hey, can u help?" → "Could you please assist me?"
→ Summarize: [Long article] → [Concise summary with key points]
```

### Advanced Reasoning
```bash
# Use o1-series models for complex problems:
→ Ask AI (o1-preview): "Solve this differential equation step by step..."
→ Explain It (o1-mini): "Why does this algorithm work?"
```

### Vision & Screenshots
```bash
# Take screenshot and:
→ Screenshot → Markdown: Converts UI elements to formatted Markdown
→ Screenshot → Explain: "What's happening in this diagram?"
→ Screenshot → Translate: Extracts and translates foreign text
```

### Smart Model Switching
```bash
# When using reasoning models with images:
o1-mini + Screenshot → Automatically switches to GPT-4o
# User sees: "Model auto-switched: Switched to GPT-4o for image processing"
```

## 🔧 Development

### Project Structure
```
src/core/
├── aiProvider.ts          # Universal AI provider implementations
├── buildAIConfig.ts       # Universal config router
├── buildOpenAIConfig.ts   # OpenAI-specific configuration
├── buildGemAIConfig.ts    # Gemini-specific configuration (legacy-compatible)
├── types.ts               # Universal type definitions
├── models.ts              # Model definitions and pricing
└── gemai.tsx              # Main UI component
```

### Key Features
- **Universal Architecture:** Single codebase supporting multiple AI providers
- **Reasoning Model Support:** Full o1-series compatibility with proper parameter handling
- **Vision Auto-switching:** Intelligent model selection for multimodal tasks
- **Real-time Analytics:** Accurate token counting and cost calculation
- **Backward Compatibility:** Seamless migration from Gemini-only version

### Building from Source
```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build

# Generate updated package.json
npx tsx generate-package.ts
```

## 📊 Analytics & Monitoring

### Usage Statistics
- **Token Usage:** Real-time tracking across all models and providers
- **Cost Analysis:** Accurate cost calculation with current pricing
- **Performance Metrics:** Response times and success rates
- **Model Comparison:** Usage patterns and preferences

### Cost Optimization
- **Smart Model Selection:** Recommendations based on task complexity
- **Usage Insights:** Identify opportunities for cost savings
- **Budget Tracking:** Monitor spending across different time periods
- **Provider Comparison:** Cost and performance analysis

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the Repository**
2. **Clone Locally:**
   ```bash
   git clone https://github.com/your-username/raycast-gemai.git
   cd raycast-gemai
   npm install
   ```
3. **Make Changes** following our coding standards
4. **Test Thoroughly** with both Gemini and OpenAI models
5. **Submit Pull Request** with detailed description

### Development Guidelines
- Maintain backward compatibility with `GemAIConfig`
- Test all new features with both AI providers
- Follow TypeScript strict mode requirements
- Update documentation for user-facing changes
- Include cost impact analysis for new models

## 🔒 Privacy & Security

- **API Keys:** Stored securely in Raycast preferences, never logged
- **Data Processing:** All AI requests go directly to respective providers
- **No Data Storage:** No conversation data stored locally or transmitted to third parties
- **Provider Policies:** Subject to Google Gemini and OpenAI privacy policies

## 📜 License

This project is licensed under the **[MIT License](LICENSE)**.

## 🙏 Acknowledgments

- **Raycast Team** for the excellent platform and development tools
- **Google** for Gemini AI models and vision capabilities  
- **OpenAI** for GPT models and reasoning capabilities
- **Community Contributors** for feedback, bug reports, and improvements

---

**Raycast GemAI** - Your universal AI assistant, powered by the best models from Google and OpenAI. Transform your workflow with intelligent automation, advanced reasoning, and seamless multimodal capabilities.

For support, feature requests, or bug reports, please visit our [GitHub Issues](https://github.com/your-username/raycast-gemai/issues).

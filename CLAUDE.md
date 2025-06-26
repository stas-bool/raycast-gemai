# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Raycast GemAI** is a universal AI assistant extension for Raycast that supports both Google Gemini and OpenAI models. The extension provides 20+ AI-powered commands for text processing, translation, summarization, code explanation, and image analysis through screenshots.

## Key Architecture

### Universal AI Provider System
- **Single Interface**: The codebase uses a universal `AIConfig` interface that abstracts both Gemini and OpenAI providers
- **Auto-switching**: Intelligent model switching (e.g., o1-series → GPT-4o for vision tasks)
- **Backward Compatibility**: Legacy `GemAIConfig` interface maintained for existing code

### Core Structure
```
src/
├── core/                    # Core AI functionality
│   ├── aiProvider.ts       # Main AI provider abstraction
│   ├── buildAIConfig.ts    # Universal config builder
│   ├── types.ts            # TypeScript interfaces
│   ├── models.ts           # Model definitions and pricing
│   └── utils.ts            # Shared utilities
├── [command].ts            # Individual Raycast commands
└── generate-package.ts     # Dynamic package.json generator
```

## Development Commands

### Build & Development
```bash
npm install                 # Install dependencies
npm run dev                # Development with hot reload
npm run build              # Production build for Raycast
```

### Linting & Quality
```bash
npm run lint               # Check code style
npm run fix-lint           # Auto-fix linting issues
```

### Package Management
```bash
npm run pull               # Pull Raycast contributions
npm run publish            # Publish to Raycast Store
```

### Dynamic Configuration
```bash
npx ts-node generate-package.ts  # Regenerate package.json from commands
```

## AI Provider Integration

### Universal Configuration
All AI operations use the `AIConfig` interface which supports:
- **Gemini Models**: 2.0 Flash-Lite, 2.0 Flash, 2.5 Flash, 2.5 Flash Thinking, 2.5 Pro
- **OpenAI Models**: GPT-4o, GPT-4o-mini, o1-preview, o1-mini (reasoning)
- **Vision Support**: Automatic detection and model switching for image inputs
- **Token Counting**: Accurate cost calculation with provider-specific pricing

### Key Implementation Details
- **Reasoning Models**: o1-series models don't support system messages or streaming
- **Vision Auto-switching**: o1-series automatically switches to GPT-4o for image processing
- **Thinking Tokens**: Gemini Thinking models have separate thinking token costs
- **Streaming**: Real-time response streaming for supported models

### Cost Tracking
The system tracks:
- Input/output tokens per provider
- Thinking/reasoning tokens separately
- Real-time cost calculation based on official API pricing
- Historical usage statistics with grouping by time periods

## Command Architecture

### Command Types
1. **Text Processing**: Grammar, Professional, Friend, Shorter, Longer, Rephraser
2. **Analysis**: Ask AI, Explainer, Summarizer, Count Tokens
3. **Translation**: Translator with multi-language support
4. **Interactive**: Chat Room with persistent context
5. **Vision**: Screenshot → Markdown/Explain/Translate
6. **Utilities**: History, Stats

### Adding New Commands
1. Define command in `src/core/commands.ts`
2. Create command file in `src/[commandName].ts`
3. Add to `generate-package.ts` command list
4. Run `npx ts-node generate-package.ts` to update package.json

## Custom Prompts System

The extension supports custom system prompts via Markdown files:
- **Directory**: `~/Documents/Prompts/Raycast` (configurable)
- **Files**: `AskQuestion.md`, `ChatRoom.md`, `Explainer.md`, etc.
- **Per-command**: Each command can specify its prompt file

## Custom Model Pricing

The extension now supports custom pricing for non-standard models:
- **Custom Model Input Price**: Price per 1M input tokens (e.g., 2.5 for $2.50)
- **Custom Model Output Price**: Price per 1M output tokens (e.g., 10.0 for $10.00)
- **Automatic Detection**: Provider detection based on model name patterns
- **Fallback Pricing**: Conservative defaults ($1.00 input, $3.00 output per 1M tokens)
- **Cost Calculation**: Accurate cost tracking for custom models in statistics

## TypeScript Configuration

- **Strict Mode**: Enabled with strict type checking
- **Target**: ES2020 with CommonJS modules
- **React**: JSX support for Raycast UI components
- **Isolated Modules**: Required for Raycast extensions

## Cursor IDE Rules

The project uses modern `.cursor/rules/` structure:
- **001-cursor-ide.mdc**: IDE configuration standards
- **010-ai-providers.mdc**: AI integration patterns and testing requirements
- **raycast-api.mdc**: Raycast-specific development patterns
- **typescript-patterns.mdc**: TypeScript best practices
- **ui-components.mdc**: UI component guidelines

## Critical Testing Scenarios

When making changes, always test:
1. **Screenshot + OpenAI**: `screenshotToMarkdown` with GPT-4o
2. **Reasoning + Vision**: Auto-switching from o1-mini to GPT-4o with images
3. **Token Statistics**: Accurate counting for both providers in `stats.tsx`
4. **Cost Calculation**: Verify against official API pricing
5. **All Commands**: Test with both Gemini and OpenAI models
6. **Error Handling**: API failures and invalid configurations

## Security & API Keys

- **No Hardcoded Keys**: All API keys via Raycast preferences
- **Local Storage**: No external data transmission beyond AI APIs
- **Rate Limiting**: Built-in handling for API quotas and errors

## Deployment

The extension is distributed through:
- **Raycast Store**: Official distribution channel
- **Local Development**: Clone and build for testing
- **Package Generation**: Dynamic `package.json` ensures all commands are properly configured
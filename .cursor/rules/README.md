# Cursor Rules for Raycast GemAI

This directory contains Cursor AI rules that provide context-aware assistance for the raycast-gemai project.

## 📁 Rule Structure

### Main Rules
- **`raycast-gemai-main.mdc`** - Core project guidelines (always applied)
- **`typescript-practices.mdc`** - TypeScript and Raycast development practices
- **`debugging-troubleshooting.mdc`** - Debugging guidelines and common issues
- **`models-pricing.mdc`** - Model management and pricing standards

### Legacy Support
- **`../.cursorrules`** - Legacy format for backward compatibility

## 🎯 Rule Activation

### Always Applied
- `raycast-gemai-main.mdc` - Applied to all conversations

### Context-Aware (Auto-Attached)
- `typescript-practices.mdc` - When working with `.ts`/`.tsx` files
- `debugging-troubleshooting.mdc` - When working with debug/error-related files
- `models-pricing.mdc` - When working with model definitions or pricing

## 🔧 Usage

### Manual Activation
Reference rules explicitly in chat:
```
@models-pricing Help me add a new GPT model
@debugging-troubleshooting Why are tokens showing as 0?
```

### Automatic Activation
Rules activate automatically based on file patterns:
- Editing `src/core/aiProvider.ts` → debugging rules active
- Editing `src/core/models.ts` → pricing rules active
- Working with `.tsx` files → TypeScript practices active

## 📋 Key Topics Covered

### Architecture
- Universal AI provider system (Gemini + OpenAI)
- `AIConfig` vs `GemAIConfig` interfaces
- Provider factory pattern and routing
- Backward compatibility requirements

### AI Provider Specifics
- Reasoning models (o1-series) limitations and requirements
- Vision API auto-switching logic
- Token counting and statistics accuracy
- Timing measurement best practices

### Development Practices
- TypeScript standards and patterns
- Raycast integration guidelines
- Error handling and user feedback
- Testing priorities and scenarios

### Business Logic
- Model pricing and cost calculations
- Provider detection for custom models
- UI integration and display names
- Monitoring and analytics

## 🧪 Testing Context

The rules include comprehensive testing guidelines for:
- Screenshot workflow with OpenAI models
- Auto-switching from reasoning to vision models
- Token counting accuracy across providers
- Cost calculation verification
- Custom model provider detection

## 🔄 Maintenance

### When to Update Rules
- Adding new AI providers or models
- Discovering new common issues or patterns
- Updating pricing or model capabilities
- Major architectural changes

### Rule Best Practices
- Keep rules focused and actionable
- Include concrete examples and code snippets
- Document reasoning behind decisions
- Maintain consistency across rule files

## 📖 Related Documentation

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [Raycast Extension Development](https://developers.raycast.com/)
- [Project README](../../README.md)

These rules are designed to help maintain code quality, architectural consistency, and user experience across the raycast-gemai project. 
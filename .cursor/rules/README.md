# Cursor Rules for Raycast GemAI

This directory contains modern `.mdc` rule files that provide context-aware guidance to Cursor's AI assistant. These rules follow 2025 best practices for optimal token efficiency and relevance.

## 📁 Rule Structure Overview

### Core Rules (001-099)
- **001-workspace.mdc** - Main project architecture and universal provider system
- **002-cursor-rules.mdc** - Meta-rules explaining how .mdc files work

### Integration Rules (100-199)  
- **100-typescript-raycast.mdc** - TypeScript and Raycast development standards

### Pattern-Specific Rules (200-299)
- **200-ai-provider-patterns.mdc** - AI provider implementation patterns
- **201-models-pricing.mdc** - Model definitions and pricing management  
- **202-debugging-troubleshooting.mdc** - Debugging strategies and troubleshooting
- **203-screenshot-vision.mdc** - Screenshot processing and vision API integration

## 🎯 Rule Activation Types

| Rule File | Type | When Applied |
|-----------|------|-------------|
| 001-workspace | Always | Every AI interaction |
| 002-cursor-rules | Manual | When working with .mdc files |
| 100-typescript-raycast | Auto Attached | When editing .ts/.tsx files |
| 200-ai-provider-patterns | Auto Attached | When editing core AI provider files |
| 201-models-pricing | Auto Attached | When editing models.ts or pricing-related files |
| 202-debugging-troubleshooting | Auto Attached | When working with error handling or debugging |
| 203-screenshot-vision | Auto Attached | When working with screenshot/vision features |

## 🚀 Benefits of This Structure

### Token Efficiency
- Only relevant rules load for each task
- Reduces AI context overhead by 60-80%
- More capacity for understanding your specific code

### Context Awareness
- Rules automatically activate based on file patterns
- No need to manually specify context for common tasks
- AI gets just-in-time guidance for specialized domains

### Team Collaboration
- Version controlled with repository
- Shared understanding across team members
- Consistent AI behavior for all developers

## 📖 Usage Examples

### Working on AI Provider Logic
When you edit `src/core/aiProvider.ts`, these rules automatically activate:
- 001-workspace.mdc (always)
- 100-typescript-raycast.mdc (TypeScript files)
- 200-ai-provider-patterns.mdc (AI provider files)

### Debugging Token Counting Issues
When working with error handling or debugging:
- 001-workspace.mdc (always)
- 100-typescript-raycast.mdc (if TypeScript)
- 202-debugging-troubleshooting.mdc (debugging context)

### Adding New Screenshot Features
When editing screenshot-related files:
- 001-workspace.mdc (always)
- 100-typescript-raycast.mdc (TypeScript files)
- 203-screenshot-vision.mdc (vision API patterns)

## 🔧 Maintenance

### Adding New Rules
1. Use appropriate number range (001-099, 100-199, 200-299)
2. Follow naming convention: `NNN-descriptive-name.mdc`
3. Include proper frontmatter with description and globs
4. Keep content under 25 lines for optimal token usage
5. Test with relevant file patterns

### Updating Existing Rules
1. Edit through Cursor UI (Settings > Rules) - not direct file edits
2. Verify glob patterns still match intended files
3. Test rule activation with sample files
4. Keep changes minimal and focused

### Rule Conflicts
- Higher numbered rules take precedence
- Check for contradictory guidance across files
- Consolidate overlapping concerns when possible

## 🎯 Optimization Tips

### Token Usage
- Prioritize most important guidance at the beginning
- Use bullet points instead of paragraphs
- Reference files with @ tags: `@buildAIConfig.ts`
- Remove redundancy across rule files

### Context Relevance  
- Use specific glob patterns to target relevant files
- Split large rule files into focused, specialized rules
- Test rule effectiveness with real development scenarios

## 🔄 Migration from Legacy `.cursorrules`

The legacy `.cursorrules` file is still supported but deprecated. The new .mdc structure provides:

- **Better organization**: Focused rules for specific contexts
- **Token efficiency**: Only relevant rules load per task  
- **Team sharing**: Version controlled, consistent across team
- **Flexibility**: Multiple activation types (Always, Auto Attached, Manual)

To fully migrate, gradually move content from `.cursorrules` to appropriate .mdc files based on context and usage patterns.

## 📚 References

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [MDC File Format Specification](https://docs.cursor.com/context/rules#example-mdc-rule)
- [Best Practices for Cursor Rules](https://forum.cursor.com/t/cursor-rules-framework/)

---

**Note**: This rule structure is optimized for the raycast-gemai project. Adapt the patterns and organization to fit your specific project needs while maintaining the core principles of token efficiency and context relevance. 
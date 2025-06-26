# Custom Model Pricing Example

This document demonstrates how to configure custom pricing for non-standard AI models in Raycast GemAI.

## Configuration Steps

1. **Set Custom Model Name**: 
   - Go to Raycast Preferences → Extensions → GemAI
   - Set "Custom Model" to your model name (e.g., `claude-3-sonnet`, `llama-3.1-70b`)

2. **Configure Input Price**:
   - Set "Custom Model Input Price" to your model's input token price per 1M tokens
   - Example: `2.5` for $2.50 per 1M input tokens

3. **Configure Output Price**:
   - Set "Custom Model Output Price" to your model's output token price per 1M tokens  
   - Example: `10.0` for $10.00 per 1M output tokens

## How It Works

### Provider Detection
The system automatically detects the provider based on model name patterns:
- **OpenAI**: Models containing `gpt`, `o1`, `chatgpt`, `claude`, `llama`, `mistral`, `azure`
- **Gemini**: All other models (fallback)

### Cost Calculation
- Input tokens: `(tokens / 1,000,000) * inputPrice`
- Output tokens: `(tokens / 1,000,000) * outputPrice`
- Total cost: `inputCost + outputCost`

### Fallback Pricing
If no custom pricing is configured:
- Input: $1.00 per 1M tokens (conservative estimate)
- Output: $3.00 per 1M tokens (conservative estimate)

## Example Configurations

### Claude via OpenAI API
```
Custom Model: claude-3-sonnet-20240229
Custom Model Input Price: 3.0
Custom Model Output Price: 15.0
```

### Local LLaMA Model
```
Custom Model: llama-3.1-70b-instruct
Custom Model Input Price: 0.1
Custom Model Output Price: 0.2
```

### Azure OpenAI
```
Custom Model: azure-gpt-4o
Custom Model Input Price: 2.5
Custom Model Output Price: 10.0
```

## Benefits

1. **Accurate Cost Tracking**: See real costs in the Statistics view
2. **Budget Management**: Monitor spending across different models
3. **Flexible Pricing**: Support for any OpenAI-compatible model
4. **Automatic Detection**: No manual provider configuration needed

## Notes

- Prices should be entered in USD per 1 million tokens
- Leave fields blank to use default conservative estimates
- The system supports both Gemini and OpenAI-compatible APIs
- Custom pricing is used throughout the extension (statistics, cost calculations, etc.)
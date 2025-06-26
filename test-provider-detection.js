// Quick test for provider detection logic
// Run with: node test-provider-detection.js

function detectProviderFromModelName(modelName) {
  const lowerModelName = modelName.toLowerCase();

  // OpenAI model patterns
  if (
    lowerModelName.includes("gpt") ||
    lowerModelName.includes("o1") ||
    lowerModelName.includes("chatgpt") ||
    lowerModelName.includes("claude") || // Anthropic models often work with OpenAI API
    lowerModelName.includes("anthropic") || // Explicit Anthropic models
    lowerModelName.includes("llama") || // Local LLaMA deployments
    lowerModelName.includes("mistral") || // Mistral models
    lowerModelName.includes("azure") // Azure OpenAI
  ) {
    return "openai";
  }

  // Default to gemini for backward compatibility
  return "gemini";
}

// Test cases
const testCases = [
  { model: "us.anthropic.claude-sonnet-4-20250514-v1:0", expected: "openai" },
  { model: "claude-3-sonnet-20240229", expected: "openai" },
  { model: "gpt-4o", expected: "openai" },
  { model: "o1-preview", expected: "openai" },
  { model: "llama-3.1-70b-instruct", expected: "openai" },
  { model: "mistral-7b", expected: "openai" },
  { model: "azure-gpt-4", expected: "openai" },
  { model: "gemini-2.0-flash", expected: "gemini" },
  { model: "palm-2", expected: "gemini" },
  { model: "custom-model", expected: "gemini" },
];

console.log("Testing provider detection logic:");
console.log("=================================");

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const result = detectProviderFromModelName(testCase.model);
  const status = result === testCase.expected ? "✅ PASS" : "❌ FAIL";
  
  console.log(`${status} | ${testCase.model} → ${result} (expected: ${testCase.expected})`);
  
  if (result === testCase.expected) {
    passed++;
  } else {
    failed++;
  }
}

console.log("=================================");
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log("🎉 All tests passed!");
} else {
  console.log("❌ Some tests failed. Please check the logic.");
}
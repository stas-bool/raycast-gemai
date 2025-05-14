import * as fs from "fs";

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const models = [
  {title: "Default", value: "default"},
  {title: "Gemini 2.0 Flash-Lite", value: "gemini-2.0-flash-lite"},
  {title: "Gemini 2.0 Flash", value: "gemini-2.0-flash"},
  {title: "Gemini 2.5 Flash Preview", value: "gemini-2.5-flash-preview-04-17"},
  {title: "Gemini 2.5 Pro Preview", value: "gemini-2.5-pro-preview-05-06"},
];

const modelPreferences = [
  {
    name: "commandModel",
    title: "Model for the command",
    description: "Specifies the model utilized for this command.",
    type: "dropdown",
    required: false,
    default: "default",
    data: models,
  },
];

const languagePreferences = [
  {
    name: "secondaryLanguage",
    title: "Secondary Language",
    description: "Please specify your second language to better configure the assistant's operation.",
    type: "textfield",
    default: "English",
    required: true,
  },
];

function makeCommand({
                       name,
                       title,
                       description,
                       hasQuery = false,
                       withSecondaryLanguage = false,
                       promptFile,
                       mode = "view",
                       temperature = "0.2",
                       modelSelector = true,
                     }: {
  name: string;
  title: string;
  mode?: string,
  description: string;
  promptFile?: string | boolean;
  hasQuery?: boolean;
  withSecondaryLanguage?: boolean | string;
  temperature?: string | boolean;
  modelSelector?: boolean;
}) {
  const preferences = [
    ...(modelSelector ? modelPreferences : []),
    ...(withSecondaryLanguage
      ? [{
        ...languagePreferences[0],
        ...(typeof withSecondaryLanguage === "string"
          ? {title: withSecondaryLanguage}
          : {})
      }]
      : []),
    ...(temperature !== false
      ? [{
        name: "temperature",
        title: "Temperature",
        description: "Lower temperatures yield deterministic responses (0 is fully deterministic), " +
          "while higher temperatures produce diverse results. Max value is 2.0",
        type: "textfield",
        required: false,
        default: typeof temperature === "string" ? temperature : "0.3",
      }]
      : []),
    ...(promptFile !== false
      ? [{
        name: "promptFile",
        title: "Markdown file with system prompt",
        description: "The system prompt to use for this command.",
        type: "textfield",
        required: false,
        default: typeof promptFile === "string" ? promptFile : `${capitalizeFirstLetter(name)}.md`,
      }]
      : []),
  ];

  return {
    name,
    title,
    description,
    mode: mode ?? "view",
    ...(hasQuery && {
      arguments: [
        {
          name: "query",
          placeholder: `Quick query text`,
          type: "text",
          required: false,
        },
      ],
    }),
    preferences,
  };
}


const commands = [
  makeCommand({
    name: "translator",
    title: "Translator",
    description: "Translate selected text.",
    withSecondaryLanguage: true,
    hasQuery: true,
  }),
  makeCommand({
    name: "grammar",
    title: "Fix Grammar & Spelling",
    description: "Fix correct grammar, spelling, punctuation for selected text.",
    withSecondaryLanguage: true,
  }),
  makeCommand({
    name: "summator",
    title: "Summarize It",
    description: "Summary selected text.",
  }),
  makeCommand({
    name: "explainer",
    title: "Explain It",
    description: "Explain selected text.",
    hasQuery: true,
  }),
  makeCommand({
    name: "friend",
    title: "Friendly Text Maker",
    description: "Make text warmer and friendly",
  }),
  makeCommand({
    name: "professional",
    title: "Professional Text Maker",
    description: "Make text formal and professional",
  }),
  makeCommand({
    name: "prompter",
    title: "Prompt Generator",
    description: "Create or improve your prompt",
    temperature: "0.6"
  }),
  makeCommand({
    name: "shorter",
    title: "Shorter Text Maker",
    description: "Make selected text significantly shorter and more concise.",
    temperature: "1.0"
  }),
  makeCommand({
    name: "longer",
    title: "Longer Text Maker",
    description: "Make selected text significantly longer.",
    temperature: "1.0"
  }),
  makeCommand({
    name: "rephraser",
    title: "Rephrase It",
    description: "Rewrite the provided text using different phrasing while maintaining the original meaning.",
    temperature: "1.0"
  }),
  makeCommand({
    name: "askQuestion",
    title: "Ask Gem AI any question",
    description: "Ask AI any question on any topic.",
    promptFile: "AskQuestion.md",
  }),
  makeCommand({
    name: "screenshotToMarkdown",
    title: "Screenshot -> Markdown",
    description: "Take a screenshot and convert it to markdown.",
    mode: "no-view",
    promptFile: "Screenshot-Markdown.md",
  }),
  makeCommand({
    name: "screenshotToExplain",
    title: "Screenshot -> Explain",
    description: "Take a screenshot and analyze it, and answer the user's question (if applicable).",
    mode: "no-view",
    promptFile: "Screenshot-Explain.md",
  }),
  makeCommand({
    name: "screenshotToTranslate",
    title: "Screenshot -> Translate",
    description: "Take a screenshot and translate it.",
    mode: "no-view",
    promptFile: "Screenshot-Translate.md",
    withSecondaryLanguage: "Source language",
  }),
  makeCommand({
    name: "history",
    title: "Gem AI history",
    description: "Take a screenshot and translate it.",
    modelSelector: false,
    temperature: false,
    promptFile: false,
  }),
];

const rootPreferences = [
  {
    name: "geminiApiKey",
    title: "Gemini API Key",
    description: "Find it at your Google AI Studio.",
    type: "password",
    required: true,
  },
  {
    description: "Which model Gemini for Raycast uses by default (unless overriden by individual commands).",
    name: "defaultModel",
    title: "Model",
    type: "dropdown",
    required: true,
    default: "gemini-2.5-flash-preview-04-17",
    data: models.slice(1), // без "Default"
  },
  {
    name: "customModel",
    title: "Custom Model",
    description: "If you are using a specific model not found in the dropdown list, configure a custom model. This selection will override the default model. If you do not have a custom model, leave this field blank.",
    type: "textfield",
    required: false,
  },
  {
    name: "primaryLanguage",
    title: "Primary language",
    description: "The default language for AI responses.",
    type: "textfield",
    default: "English",
    required: true,
  },
  {
    name: "promptDir",
    title: "Prompt Directory",
    description: "The full path to the directory containing Prompts in markdown format.",
    type: "textfield",
    required: false,
    default: "~/Documents/Prompts/Raycast",
  },
];

const pkg = {
  $schema: "https://www.raycast.com/schemas/extension.json",
  name: "gemai",
  title: "Gem AI",
  description: "Gemini Toolbox for quick text editing, BYOK.",
  icon: "gemai-icon.png",
  type: "module",
  author: "SmetDenis",
  owner: "SmetDenis",
  categories: ["Productivity", "Developer Tools"],
  license: "MIT",
  commands,
  preferences: rootPreferences,
  dependencies: {
    "@google/genai": "^0.13.0",
    "@raycast/api": "^1.98.2",
    "@raycast/utils": "^1.17.0",
    "mime-types": "^3.0.1",
  },
  devDependencies: {
    "@raycast/eslint-config": "^2.0.4",
    "@types/node": "22.13.10",
    "@types/react": "19.0.10",
    eslint: "^9.22.0",
    prettier: "^3.5.3",
    typescript: "^5.8.2",
  },
  scripts: {
    build: "ray build -e dist",
    dev: "ray develop",
    "fix-lint": "ray lint --fix",
    lint: "ray lint",
    pull: "ray pull-contributions",
    publish: "ray publish",
  },
};

fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n", "utf-8");
console.log("package.json updated!");

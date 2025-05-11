import * as fs from "fs";

function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Общий список моделей
const models = [
    {title: "Default", value: "default"},
    {title: "Gemini 2.0 Flash-Lite", value: "gemini-2.0-flash-lite"},
    {title: "Gemini 2.0 Flash", value: "gemini-2.0-flash"},
    {title: "Gemini 2.5 Flash Preview", value: "gemini-2.5-flash-preview-04-17"},
    {title: "Gemini 2.5 Pro Preview", value: "gemini-2.5-pro-preview-05-06"},
];

// Общие preferences для команд с языками
const languagePreferences = [
    {
        name: "commandModel",
        title: "Specific Model",
        description: "Which model this command uses.",
        type: "dropdown",
        required: false,
        default: "default",
        data: models,
    },
    {
        name: "secondaryLanguage",
        title: "Secondary Language",
        description: "Please specify your second language to better configure the assistant's operation.",
        type: "textfield",
        default: "English",
        required: true,
    },
];

// Общие preferences для команд без secondaryLanguage
const modelPreferences = [
    {
        name: "commandModel",
        title: "Specific Model",
        description: "Which model this command uses.",
        type: "dropdown",
        required: false,
        default: "default",
        data: models,
    },
];

// Фабрика для команд
function makeCommand({name, title, description, promptFile, hasQuery = true, withSecondaryLanguage = true}: {
    name: string;
    title: string;
    description: string;
    promptFile: string;
    hasQuery?: boolean;
    withSecondaryLanguage?: boolean;
}) {
    return {
        name,
        title,
        description,
        mode: "view",
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
        preferences: [
            ...(withSecondaryLanguage ? languagePreferences : modelPreferences),
            {
                name: "promptFile",
                title: "Markdown file with system prompt",
                description: "The system prompt to use for this command.",
                type: "textfield",
                required: false,
                default: `${capitalizeFirstLetter(name)}.md`,
            },
        ],
    };
}

// Список команд
const commands = [
    makeCommand({
        name: "translator",
        title: "Translator",
        description: "Translate selected text",
        promptFile: "Translator.md",
        withSecondaryLanguage: true,
    }),
    makeCommand({
        name: "grammar",
        title: "Fix grammar & spelling",
        description: "Fix correct grammar, spelling, punctuation for selected text",
        promptFile: "Grammar.md",
        withSecondaryLanguage: false,
    }),
    makeCommand({
        name: "summator",
        title: "Summarize it",
        description: "Summary selected text",
        promptFile: "Summator.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "explainer",
        title: "Explain it",
        description: "Explain selected text",
        promptFile: "Explainer.md",
        withSecondaryLanguage: false,
        hasQuery: true,
    }),
    makeCommand({
        name: "friend",
        title: "Make it friendly",
        description: "Make text friendlier",
        promptFile: "Friend.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "professional",
        title: "Make it professional",
        description: "Make text formal and professional",
        promptFile: "Professional.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "prompter",
        title: "Prompt Generator",
        description: "Create or improve your prompt",
        promptFile: "Prompter.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "shorter",
        title: "Make text shorter",
        description: "Make selected text significantly shorter and more concise",
        promptFile: "Shorter.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "longer",
        title: "Make text longer",
        description: "Make selected text significantly longer",
        promptFile: "Longer.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
    makeCommand({
        name: "rephraser",
        title: "Rephrase it",
        description: "Rewrite the provided text using different phrasing while maintaining the original meaning.",
        promptFile: "Rephraser.md",
        withSecondaryLanguage: false,
        hasQuery: false,
    }),
];

// Корневые preferences
const rootPreferences = [
    {
        name: "geminiApiKey",
        title: "Gemini API Key",
        description: "Find it in your Google AI Studio.",
        type: "password",
        required: true,
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
        description: "Setup custom model if you are using a specific model not included in the dropdown menu. This option will override the default model. Leave this field empty if you do not have a custom model.",
        type: "textfield",
        required: false,
    },
    {
        name: "promptDir",
        title: "Prompt directory",
        description: "The full path to the directory containing Prompts in markdown format",
        type: "textfield",
        required: false,
        default: "~/Documents/Prompts/Raycast",
    },
];

// Финальный объект package.json
const pkg = {
    $schema: "https://www.raycast.com/schemas/extension.json",
    name: "gemai",
    title: "GemAI",
    description: "AI Toolbox for text editing.",
    icon: "gemai-icon.png",
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

// Запись файла
fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2), "utf-8");
console.log("package.json успешно сгенерирован!");

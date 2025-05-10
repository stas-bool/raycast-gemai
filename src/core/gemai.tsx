import {
    Detail,
    ActionPanel,
    Action,
    Form,
    Keyboard,
    launchCommand,
    getSelectedText,
    Toast,
    Icon,
    LaunchType,
    showToast
} from "@raycast/api";
import {useEffect, useState} from "react";
import {GeminiRequestParams, GeminiModelParams, RaycastUIParams} from "./types";
import {GoogleGenAI, createPartFromUri, GenerateContentResponse} from '@google/genai';
import * as fs from "fs";
import * as path from "path";
import mime from "mime-types";

const Pages = {Form: 0, Detail: 1};

export default function GemAI(request: GeminiRequestParams, model: GeminiModelParams, ui: RaycastUIParams) {

    // Init states
    const [selectedState, setSelectedText] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [page, setPage] = useState(Pages.Detail);
    const [isLoading, setIsLoading] = useState(true);
    const [textarea, setTextarea] = useState("");
    const [lastQuery, setLastQuery] = useState("");
    const [lastResponse, setLastResponse] = useState("");
    const [renderedText, setRenderedText] = useState("");

    const processFile = async (ai: GoogleGenAI, actualFilePath?: string) => {
        if (!actualFilePath || !fs.existsSync(actualFilePath) || !fs.lstatSync(actualFilePath).isFile()) {
            return null;
        }

        try {
            const fileName = path.basename(actualFilePath);
            const mimeType = mime.lookup(fileName) || "application/octet-stream";
            const fileBuffer = fs.readFileSync(actualFilePath);
            const blob = new Blob([fileBuffer], {type: mimeType});

            const file = await ai.files.upload({
                file: blob,
                config: {
                    displayName: fileName,
                    mimeType: mimeType,
                },
            });

            let getFile = await ai.files.get({name: file.name});
            while (getFile.state === 'PROCESSING') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                getFile = await ai.files.get({name: file.name});
            }

            if (getFile.state === 'FAILED') {
                throw new Error('File processing failed');
            }

            if (file.uri && file.mimeType) {
                return createPartFromUri(file.uri, file.mimeType);
            }

            return null;
        } catch (fileError) {
            console.error("Error processing file:", fileError);
            await showToast({
                style: Toast.Style.Failure,
                title: "File processing failed",
                message: fileError.message
            });
            return null;
        }
    };

    const sendRequestToGemini = async (ai: GoogleGenAI, query: unknown, filePart: unknown) => {
        const contents = [query];
        if (filePart) {
            contents.push(filePart);
        }

        const thinkingConfig = {includeThoughts: false, thinkingBudget: model.thinkingBudget ?? 4096};
        const thinkingModels = ['gemini-2.5-flash-preview-04-17', 'gemini-2.5-pro-preview-05-06'];

        const requestParams = {
            model: model.modelName,
            contents: contents,
            config: {
                maxOutputTokens: model.maxOutputTokens,
                temperature: model.temperature,
                ...(thinkingModels.includes(model.modelName) && {thinkingConfig}),
                systemInstruction: model.systemPrompt,
                topK: model.topK,
                topP: model.topP,
                frequencyPenalty: model.frequencyPenalty,
                presencePenalty: model.presencePenalty,
            },
        };

        console.log(requestParams)

        return await ai.models.generateContentStream(requestParams);
    };

    const processResponse = async (ai: GoogleGenAI, response, query, start) => {
        let markdown = "";
        let usageMetadata = undefined;

        for await (const chunk of response) {
            markdown += chunk.text;
            setMarkdown(markdown);
            usageMetadata = chunk.usageMetadata;
        }

        setLastResponse(markdown);

        const inputTokens = await ai.models.countTokens({model: model.modelName, contents: query});

        const timer = `Time: ${((Date.now() - start) / 1000).toFixed(1)} sec`;
        const stats = `*Model: ${model.modelName}*\n\n` +
            `*${timer}; ` +
            `Prompt: ${usageMetadata?.promptTokenCount ?? 0}; ` +
            `Input: ${inputTokens?.totalTokens ?? 0}; ` +
            `Thinking: ${usageMetadata?.thoughtsTokenCount ?? 0}; ` +
            `Total: ${usageMetadata?.totalTokenCount ?? 0}*`;

        // await addToHistory(query, markdown, modelName);
        await showToast({style: Toast.Style.Success, title: "OK", message: timer});

        setRenderedText(`${markdown}\n\n----\n\n${stats}`);
        return markdown;
    };

    const getResponse = async (query?: string, data?: any) => {
        setLastQuery(query);
        setPage(Pages.Detail);

        await showToast({style: Toast.Style.Animated, title: "Waiting for AI..."});

        const start = Date.now();
        const ai = new GoogleGenAI({apiKey: model.geminiApiKey});

        try {
            const actualFilePath = data?.attachmentFile || request.attachmentFile;
            const filePart = await processFile(ai, actualFilePath);

            const response = await sendRequestToGemini(ai, query, filePart);
            await processResponse(ai, response, query, start);
        } catch (e) {
            console.error(e);
            await showToast({style: Toast.Style.Failure, title: "Response Failed"});
            setMarkdown(`## Fatal Error\n\n${e.message}\n\n ${(Date.now() - start) / 1000} seconds`);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            try {
                let selectedText = "";

                if (ui.useSelected) {
                    try {
                        selectedText = await getSelectedText();
                        setSelectedText(selectedText);
                    } catch (e) {
                        await showToast({style: Toast.Style.Success, title: "No selected text. Use form."});
                        selectedText = "";
                    }
                }

                const hasUserPrompt = request.userPrompt.trim() !== "";
                const hasSelected = selectedText.trim() !== "";

                if (!hasUserPrompt && !hasSelected) {
                    setPage(Pages.Form);
                    return;
                }

                if (hasUserPrompt && hasSelected) {
                    getResponse(`${request.userPrompt}\n\n----\n\n${selectedText}`);
                } else if (hasUserPrompt) {
                    getResponse(request.userPrompt);
                } else if (hasSelected) {
                    getResponse(selectedText);
                }
            } catch (e) {
                console.error("Fatal error in useEffect:", e);
                await showToast({
                    style: Toast.Style.Failure,
                    title: "An error occurred",
                    message: e.message
                });
                setPage(Pages.Detail);
                setMarkdown(e.message)
            }
        })();
    }, []);

    return page === Pages.Detail ? (
        <Detail
            actions={
                !isLoading && (
                    <ActionPanel>
                        {ui.allowPaste && <Action.Paste content={markdown} />}
                        <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.Copy} content={markdown} />
                        {lastQuery && lastResponse && (
                            <Action
                                title="Continue in Chat"
                                icon={Icon.Message}
                                shortcut={{modifiers: ["cmd"], key: "j"}}
                                onAction={async () => {
                                    await launchCommand({
                                        name: "aiChat",
                                        type: LaunchType.UserInitiated,
                                        context: {query: lastQuery, response: lastResponse, creationName: ""},
                                    });
                                }}
                            />
                        )}
                        <Action
                            title="View History"
                            icon={Icon.Clock}
                            shortcut={{modifiers: ["cmd"], key: "h"}}
                            onAction={async () => {
                                await launchCommand({name: "history", type: LaunchType.UserInitiated,});
                            }}
                        />
                    </ActionPanel>
                )
            }
            isLoading={isLoading}
            markdown={renderedText}
        />
    ) : (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm
                        onSubmit={(values) => {
                            setMarkdown("");

                            let filePathValue = undefined;
                            if (values?.file?.length > 0 &&
                                fs.existsSync(values.file[0]) &&
                                fs.lstatSync(values.file[0]).isFile()
                            ) {
                                filePathValue = values.file[0];
                            }

                            if (ui.useSelected) {
                                getResponse(`${values.query}\n\n---\n\n${selectedState}`, {attachmentFile: filePathValue});
                                return;
                            }

                            getResponse(values.query, {attachmentFile: filePathValue});
                        }}
                    />
                    <Action
                        icon={Icon.Clipboard}
                        title="Append Selected Text"
                        onAction={async () => {
                            try {
                                const selectedText = await getSelectedText();
                                setTextarea((text) => text + selectedText);
                            } catch (error) {
                                await showToast({
                                    title: "Could not get the selected text",
                                    style: Toast.Style.Failure,
                                });
                            }
                        }}
                        shortcut={{modifiers: ["ctrl", "shift"], key: "v"}}
                    />
                </ActionPanel>
            }
        >
            <Form.TextArea
                id="query"
                value={textarea}
                onChange={(value) => setTextarea(value)}
                placeholder={ui.placeholder}
                autoFocus={true}
            />
            {!request.attachmentFile && (
                <>
                    <Form.Description title="Attachment" text="You can attach an image or file to analyze with your prompt." />
                    <Form.FilePicker id="file" title="" allowMultipleSelection={false} />
                    <Form.Description text="Note that attachment will not be carried over if you continue in Chat." />
                </>
            )}
        </Form>
    );
};

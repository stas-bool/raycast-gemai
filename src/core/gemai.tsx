import {
    Detail,
    ActionPanel,
    Action,
    Form,
    Keyboard,
    getSelectedText,
    Toast,
    showToast
} from "@raycast/api";
import {useEffect, useState} from "react";
import {GemAIConfig} from "./types";
import {GoogleGenAI, createPartFromUri, Part} from '@google/genai';
import * as fs from "fs";
import * as path from "path";
import mime from "mime-types";

export async function prepareAttachment(ai: GoogleGenAI, actualFilePath?: string): Promise<Part> {
    if (!actualFilePath || !fs.existsSync(actualFilePath) || !fs.lstatSync(actualFilePath).isFile()) {
        return null;
    }

    try {
        const fileName = path.basename(actualFilePath);
        const mimeType = mime.lookup(fileName) || "application/octet-stream";
        const fileBuffer = fs.readFileSync(actualFilePath);
        const blob = new Blob([fileBuffer], {type: mimeType});
        const file = await ai.files.upload({file: blob, config: {displayName: fileName, mimeType: mimeType}});

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
    } catch (fileError: any) {
        console.error("Error processing file:", fileError);
        await showToast({
            style: Toast.Style.Failure,
            title: "File processing failed",
            message: fileError.message
        });
        return null;
    }
}

export async function sendRequestToGemini(
    ai: GoogleGenAI,
    gemConfig: GemAIConfig,
    query?: string,
    filePart?: Part,
) {
    const contents = [query];
    if (filePart) {
        // @ts-ignore
        contents.push(filePart);
    }

    const requestParams = {
        model: gemConfig.model.modelName,
        contents: contents,
        config: {
            maxOutputTokens: gemConfig.model.maxOutputTokens,
            temperature: gemConfig.model.temperature,
            thinkingConfig: gemConfig.model.thinkingConfig,
            systemInstruction: gemConfig.model.systemPrompt,
            frequencyPenalty: gemConfig.model.frequencyPenalty,
            presencePenalty: gemConfig.model.presencePenalty,
            topK: gemConfig.model.topK,
            topP: gemConfig.model.topP,
        },
    };

    // console.log(requestParams);

    return await ai.models.generateContentStream(requestParams);
}

// --- Main component ---
export default function GemAI(gemConfig: GemAIConfig) {
    // dump({request, model, ui});

    const PageState = {Form: 0, Response: 1};

    // Init states
    const [selectedState, setSelectedText] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [page, setPage] = useState(PageState.Response);
    const [isLoading, setIsLoading] = useState(true);
    const [textarea, setTextarea] = useState("");
    const [lastQuery, setLastQuery] = useState("");
    const [lastResponse, setLastResponse] = useState("");
    const [renderedText, setRenderedText] = useState("");

    const getAiResponse = async (query?: string, data?: any) => {
        setLastQuery(query);
        setPage(PageState.Response);

        await showToast({style: Toast.Style.Animated, title: "Waiting for AI..."});

        const startTime = Date.now();
        const ai = new GoogleGenAI({apiKey: gemConfig.model.geminiApiKey});

        try {
            const actualFilePath = data?.attachmentFile || gemConfig.request.attachmentFile;
            const filePart = await prepareAttachment(ai, actualFilePath);
            const response = await sendRequestToGemini(ai, gemConfig, query, filePart);
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

            let markdown = "";
            let usageMetadata = undefined;

            for await (const chunk of response) {
                markdown += chunk.text;
                setMarkdown(markdown);
                setRenderedText(markdown);
                usageMetadata = chunk.usageMetadata;
            }

            setMarkdown(markdown.trim() + "\n");
            setLastResponse(markdown);

            const inputTokens = await ai.models.countTokens({model: gemConfig.model.modelName, contents: query});

            const timer = `Time: ${totalTime} sec`;
            const stats = `*Model: ${gemConfig.model.modelName}*\n\n` +
                `*${timer}; ` +
                `Prompt: ${usageMetadata?.promptTokenCount ?? 0}; ` +
                `Input: ${inputTokens?.totalTokens ?? 0}; ` +
                `Thinking: ${usageMetadata?.thoughtsTokenCount ?? 0}; ` +
                `Total: ${usageMetadata?.totalTokenCount ?? 0}*`;

            setRenderedText(`${markdown}\n\n----\n\n${stats}`);

            await showToast({style: Toast.Style.Success, title: "OK", message: timer});
        } catch (e: any) {
            console.error(e);
            await showToast({style: Toast.Style.Failure, title: "Response Failed"});
            setRenderedText(`## Fatal Error\n\n----\n\n${e.message}\n\n----\n\n${(Date.now() - startTime) / 1000} seconds`);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        (async () => {
            try {
                let selectedText = "";

                if (gemConfig.ui.useSelected) {
                    try {
                        selectedText = await getSelectedText();
                        setSelectedText(selectedText);
                    } catch (e) {
                        await showToast({style: Toast.Style.Success, title: "No selected text. Use form."});
                        selectedText = "";
                    }
                }

                const hasUserPrompt = gemConfig.request.userPrompt.trim() !== "";
                const hasSelected = selectedText.trim() !== "";

                if (!hasUserPrompt && !hasSelected) {
                    setPage(PageState.Form);
                    return;
                }

                if (hasUserPrompt && hasSelected) {
                    getAiResponse(`${gemConfig.request.userPrompt}\n\n${selectedText}`);
                } else if (hasUserPrompt) {
                    getAiResponse(gemConfig.request.userPrompt);
                } else if (hasSelected) {
                    getAiResponse(selectedText);
                }
            } catch (e: any) {
                console.error("Fatal error in useEffect:", e);
                await showToast({style: Toast.Style.Failure, title: "An error occurred", message: e.message});
                setPage(PageState.Response);
                setMarkdown(e.message)
            }
        })();
    }, []);

    return page === PageState.Response ? (
        <Detail
            actions={
                !isLoading && (
                    <ActionPanel>
                        {gemConfig.ui.allowPaste && <Action.Paste content={markdown} />}
                        <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.Copy} content={markdown} />
                        {/*{lastQuery && lastResponse && (*/}
                        {/*    <Action*/}
                        {/*        title="Continue in Chat"*/}
                        {/*        icon={Icon.Message}*/}
                        {/*        shortcut={{modifiers: ["cmd"], key: "j"}}*/}
                        {/*        onAction={async () => {*/}
                        {/*            await launchCommand({*/}
                        {/*                name: "aiChat",*/}
                        {/*                type: LaunchType.UserInitiated,*/}
                        {/*                context: {query: lastQuery, response: lastResponse, creationName: ""},*/}
                        {/*            });*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {/*<Action*/}
                        {/*    title="View History"*/}
                        {/*    icon={Icon.Clock}*/}
                        {/*    shortcut={{modifiers: ["cmd"], key: "h"}}*/}
                        {/*    onAction={async () => {*/}
                        {/*        await launchCommand({name: "history", type: LaunchType.UserInitiated,});*/}
                        {/*    }}*/}
                        {/*/>*/}
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

                            if (gemConfig.ui.useSelected) {
                                getAiResponse(`${values.query}\n\n---\n\n${selectedState}`, {attachmentFile: filePathValue});
                                return;
                            }

                            getAiResponse(values.query, {attachmentFile: filePathValue});
                        }}
                    />
                </ActionPanel>
            }
        >
            <Form.TextArea
                id="query"
                title="User Prompt"
                value={textarea}
                onChange={(value) => setTextarea(value)}
                placeholder={gemConfig.ui.placeholder}
                autoFocus={true}
            />
            {!gemConfig.request.attachmentFile && (
                <>
                    <Form.Description title="Attachment" text="You can attach image or file to analyze it." />
                    <Form.FilePicker id="file" title="" showHiddenFiles={true} allowMultipleSelection={false} />
                </>
            )}
        </Form>
    );
};

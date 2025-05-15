import { createPartFromUri, GoogleGenAI, Part } from "@google/genai";
import { Action, ActionPanel, Detail, Form, getSelectedText, Icon, Keyboard, showToast, Toast } from "@raycast/api";
import * as fs from "fs";
import mime from "mime-types";
import * as path from "path";
import { useEffect, useState } from "react";
import { useCommandHistory } from "./history";
import { GemAIConfig, RequestStats } from "./types";
import { dump, renderStats } from "./utils";

async function prepareAttachment(ai: GoogleGenAI, actualFilePath?: string): Promise<Part> {
  if (!actualFilePath || !fs.existsSync(actualFilePath) || !fs.lstatSync(actualFilePath).isFile()) {
    return null;
  }

  try {
    const fileName = path.basename(actualFilePath);
    const mimeType = mime.lookup(fileName) || "application/octet-stream";
    const fileBuffer = fs.readFileSync(actualFilePath);
    const blob = new Blob([fileBuffer], { type: mimeType });
    const file = await ai.files.upload({ file: blob, config: { displayName: fileName, mimeType: mimeType } });

    let getFile = await ai.files.get({ name: file.name });
    while (getFile.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getFile = await ai.files.get({ name: file.name });
    }

    if (getFile.state === "FAILED") {
      throw new Error("File processing failed");
    }

    if (file.uri && file.mimeType) {
      return createPartFromUri(file.uri, file.mimeType);
    }

    return null;
  } catch (fileError: any) {
    console.error("Error processing file:", fileError);
    await showToast({ style: Toast.Style.Failure, title: "File processing failed", message: fileError.message });
    return null;
  }
}

async function sendRequestToGemini(ai: GoogleGenAI, gemConfig: GemAIConfig, query?: string, filePart?: Part) {
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
      safetySettings: gemConfig.model.safetySettings,
    },
  };

  dump(
    {
      system: requestParams.config.systemInstruction,
      model: requestParams.model,
      contents: requestParams.contents,
    },
    "Real request",
  );

  return await ai.models.generateContentStream(requestParams);
}

async function getTokenStats(ai, gemConfig, usageMetadata, query, filePart): Promise<RequestStats> {
  const inputTokens = await ai.models.countTokens({
    model: gemConfig.model.modelName,
    contents: filePart ? [query, filePart] : [query],
  });

  return {
    prompt: usageMetadata?.promptTokenCount ?? 0,
    input: inputTokens?.totalTokens ?? 0,
    thoughts: usageMetadata?.thoughtsTokenCount ?? 0,
    total: usageMetadata?.totalTokenCount ?? 0,
    firstRespTime: 0,
    totalTime: 0,
  };
}

// --- Main component ---
export default function GemAI(gemConfig: GemAIConfig) {
  const PageState = { Form: 0, Response: 1 };

  // Init states
  const [markdown, setMarkdown] = useState("");
  const [page, setPage] = useState(PageState.Response);
  const [isLoading, setIsLoading] = useState(true);
  const [textarea, setTextarea] = useState("");
  const [renderedText, setRenderedText] = useState("");
  const [latestQuery, setLatestQuery] = useState({ query: undefined, attachmentFile: undefined });
  const { addToHistory, getHistoryStats } = useCommandHistory();

  const getAiResponse = async (query?: string, attachmentFile?: string) => {
    setPage(PageState.Response);
    setLatestQuery({ query: query, attachmentFile: attachmentFile });
    // dumpLog({ query, attachmentFile }, "getAiResponse");

    await showToast({
      style: Toast.Style.Animated,
      title: `Waiting for ${gemConfig.request.actionName} GemAI; ${gemConfig.model.modelNameUser}`,
    });

    const startTime = Date.now();
    const ai = new GoogleGenAI({ apiKey: gemConfig.model.geminiApiKey });

    try {
      const actualFilePath = attachmentFile || gemConfig.request.attachmentFile;
      const filePart = await prepareAttachment(ai, actualFilePath);
      const response = await sendRequestToGemini(ai, gemConfig, query, filePart);
      const firstRespTime = (Date.now() - startTime) / 1000;

      let markdown = "";
      let usageMetadata = undefined;
      let totalTime = 0;

      for await (const chunk of response) {
        if (typeof chunk.text === "string") {
          markdown += chunk.text; // Add only if chunk.text is defined. Without 'undefined'.
        }
        setRenderedText(markdown);
        usageMetadata = chunk.usageMetadata;
        totalTime = (Date.now() - startTime) / 1000;
        showToast({ style: Toast.Style.Animated, title: `Typing...` });
      }

      setMarkdown(markdown);

      await showToast({
        style: Toast.Style.Success,
        title: "OK",
        message: `Total time: ${totalTime} sec; Tokens: ${usageMetadata?.totalTokenCount}`,
      });

      const requestStats = await getTokenStats(ai, gemConfig, usageMetadata, query, filePart);
      requestStats.firstRespTime = firstRespTime;
      requestStats.totalTime = totalTime;

      const stats = renderStats(gemConfig.model.modelNameUser, gemConfig.model.temperature, requestStats);

      await addToHistory({
        timestamp: Date.now(),
        actionName: gemConfig.request.actionName,
        query: query,
        isAttachmentFile: !!gemConfig.request.attachmentFile,
        response: markdown,
        stats: stats,
        requestStats: requestStats,
      });

      const historyStatsMessage = await getHistoryStats();

      setRenderedText(`${markdown}\n\n----\n\n*${stats}*\n\n*${historyStatsMessage}*`);
    } catch (e: any) {
      console.error(e);
      await showToast({ style: Toast.Style.Failure, title: "Response Failed" });
      setRenderedText(`## Fatal Error\n\n----\n\n${e.message}\n\n----\n\n${(Date.now() - startTime) / 1000} seconds`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        let selectedText = "";

        if (gemConfig.ui.useSelected) {
          try {
            selectedText = await getSelectedText();
          } catch (e) {
            await showToast({ style: Toast.Style.Success, title: "No selected text. Use form." });
            selectedText = "";
          }
        }

        const hasUserPrompt = gemConfig.request.userPrompt.trim() !== "";
        const hasSelected = selectedText.trim() !== "";

        if (!hasUserPrompt && !hasSelected) {
          setPage(PageState.Form);
          return;
        }

        if (hasUserPrompt) {
          getAiResponse(gemConfig.request.userPrompt);
        } else if (hasSelected) {
          getAiResponse(selectedText);
        }
      } catch (e: any) {
        console.error("Fatal error in useEffect:", e);
        await showToast({ style: Toast.Style.Failure, title: "An error occurred", message: e.message });
        setPage(PageState.Response);
        setMarkdown(e.message);
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
            <Action
              title="Submit Again"
              icon={Icon.Repeat}
              shortcut={Keyboard.Shortcut.Common.Refresh}
              onAction={async () => {
                setMarkdown("");
                setRenderedText("Resent request. Waiting...");
                getAiResponse(latestQuery.query, latestQuery.attachmentFile);
              }}
            />
          </ActionPanel>
        )
      }
      isLoading={isLoading}
      markdown={renderedText}
      navigationTitle={gemConfig.request.actionName}
    />
  ) : (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values) => {
              setMarkdown("");

              let filePathValue = undefined;
              if (values?.file?.length > 0 && fs.existsSync(values.file[0]) && fs.lstatSync(values.file[0]).isFile()) {
                filePathValue = values.file[0];
              }

              getAiResponse(values.query, filePathValue);
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
}

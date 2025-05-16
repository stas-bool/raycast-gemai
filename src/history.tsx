import { Action, ActionPanel, Color, confirmAlert, Icon, List } from "@raycast/api";
import { getCmd } from "./core/commands";
import { useCommandHistory } from "./core/history";
import { HistoryItem } from "./core/types";
import { formatDate } from "./core/utils";

function formatMarkdown(item: HistoryItem): string {
  const date = formatDate(new Date(item.timestamp));
  return (
    `### Query at ${date}:\n\n` +
    `${item.query}\n\n` +
    `---\n\n` +
    `### Response:\n\n` +
    `${item.response}\n\n` +
    `---\n\n` +
    `*${item.stats}*`
  );
}

function formatTitle(item: HistoryItem): string {
  let result = "";
  let title = item.query?.trim();
  // денис
  if (title) {
    result += (title.length > 60 ? title.substring(0, 60) + "..." : title).trim();
  } else {
    result += "~ No Text Query ~";
  }

  return result;
}

function getAccessories(item: HistoryItem) {
  let accessries = [
    {
      tag: { value: getCmd(item.actionName).name, color: Color.SecondaryText },
      tooltip: "Assistant name",
    },
  ];

  if (item.isAttachmentFile) {
    accessries.push({ tag: { value: "File", color: Color.Blue }, tooltip: "File as part of query" });
  }

  return accessries;
}

export default function History() {
  const { history, clearHistory, removeFromHistory } = useCommandHistory();
  return (
    <List isShowingDetail searchBarPlaceholder="Search your query">
      {history.map((item: HistoryItem) => (
        <List.Item
          key={item.timestamp}
          title={formatTitle(item)}
          accessories={getAccessories(item)}
          detail={<List.Item.Detail markdown={formatMarkdown(item)} />}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Response"
                content={item.response}
                shortcut={{ modifiers: ["cmd"], key: "c" }}
              />
              <Action.CopyToClipboard
                title="Copy Query"
                content={item.query}
                shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
              />
              <Action
                title="Delete This Entry"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["ctrl"], key: "backspace" }}
                onAction={async () => {
                  if (await confirmAlert({ title: "Delete this entry?" })) {
                    await removeFromHistory(item.timestamp);
                  }
                }}
              />
              <Action
                title="Clear History"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["shift", "cmd"], key: "backspace" }}
                onAction={async () => {
                  if (await confirmAlert({ title: "Are you sure?" })) {
                    clearHistory();
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

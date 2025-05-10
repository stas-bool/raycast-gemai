import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export function getSystemPrompt(promptPath: string | undefined, defaultPrompt?: string): string {
    let resolvedPath = promptPath ? promptPath.trim() : "";

    if (resolvedPath.startsWith("~")) {
        resolvedPath = path.join(os.homedir(), resolvedPath.slice(1));
    }

    let finalPrompt = "";

    if (resolvedPath && fs.existsSync(resolvedPath)) {
        finalPrompt = fs.readFileSync(resolvedPath, "utf8");
        finalPrompt = finalPrompt.replace(/^---[\s\S]*?---\s*/, "");
        finalPrompt = finalPrompt.trim() + "\n";
    } else if (defaultPrompt) {
        finalPrompt = defaultPrompt.trim() + "\n";
    }

    return finalPrompt;
}

export function dump(variable: unknown, label?: string): void {
    if (label) {
        console.debug(label + ":", JSON.stringify(variable));
    } else {
        console.debug(JSON.stringify(variable));
    }
}

export function dumpLog(variable: unknown, label?: string): void {
    if (label) {
        console.debug(label + ":", variable);
    } else {
        console.debug(variable);
    }
}

export function toMdJson(variable: unknown): string {
    return [
        "```json",
        JSON.stringify(variable, null, 2),
        "```",
    ].join("\n")
}

import {getPreferenceValues} from "@raycast/api";
import {buildGemAIConfig} from "./core/buildGemAIConfig";
import GemAI from "./core/gemai";

/* props = {
    fallbackText: undefined,
    arguments: {},
    launchType: 'userInitiated',
    launchContext: undefined
} */
export default function Translate(props) {
    const prefs = getPreferenceValues();
    const pimary = prefs.primaryLanguage.trim().toUpperCase();
    const secondary = prefs.secondaryLanguage.trim().toUpperCase();

    const fallbackPrompt = `Please translate the text (${pimary} <> ${secondary}),
ensuring the meaning is precisely preserved and the result sounds natural and clear to a native speaker.
To accomplish this, you may reorder words, but ONLY within their original sentence.
Please do not distort or simplify the content.
If the following text is in ${pimary} then translate it to ${secondary}, otherwise translate following text to ${pimary}.
ALSWAYS ONLY return the translated text and nothing else.`;

    [request, model, ui] = buildGemAIConfig(props, fallbackPrompt);
    model.temperature = 0.7;
    ui.placeholder = "Enter text to translate.";
    ui.useSelected = true;

    return GemAI(request, model, ui);
}

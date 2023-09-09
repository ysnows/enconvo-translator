// Usage
import * as process from "process";
import {Clipboard, language, req, res} from "enconvo/api";
import {OpenAI, PromptTemplate} from "langchain";
import {CallbackManager} from "langchain/callbacks";

export default async function main() {
    try {
        const {text, context, options} = req.body();
        console.log("env-:", process.env);

        let translateText = text || context || await Clipboard.selectedText();
        console.log("translateText:", translateText);

        // 如果translateText中有换行符，需要添加> 符号
        // const displayText = translateText.replace(/\n/g, "\n> ");
        // await res.write(`> ${displayText}\n\n`);

        const sourceLang = await language.detect(translateText);

        let targetLang = "zh";
        if (sourceLang === "zh-Hans") {
            targetLang = "en";
        } else {
            targetLang = "zh-Hans";
        }

        console.log(`sourceLang is ${JSON.stringify(sourceLang)}`);
        let isWord = language.isWord(sourceLang, translateText);
        console.log(`isWord is ${isWord}`);
        options.verbose = true;
        options.stream = true;
        translateText = language.splitWord(translateText);

        isWord = language.isWord(sourceLang, translateText);
        console.log(`isWord is ${isWord}`);

        const templateText = `Act as a {sourceLang}-{targetLang} Dictionary for word most common two meaning with America phonetic symbols. 
Query Word: """{text}"""
    
Result Formats:
美: [phonetic symbols]

[abbr of part of speech] {targetLang} Meaning]

Example:
美: [dɪˈspleɪ]

[n] 显示

[v] 显示

Result:`;
        ;

        let messages;

        if (isWord) {
            const template = PromptTemplate.fromTemplate(templateText);
            console.log("template:", template.inputVariables);

            messages = await template.format({
                text: translateText,
                sourceLang: sourceLang,
                targetLang: targetLang
            });

        } else {
            const template = PromptTemplate.fromTemplate(`Translate the text to {targetLang}.
            Text: {text}
            Translation:`);

            messages = await template.format({text: translateText, targetLang: targetLang});
        }


        const chat = new OpenAI({
                temperature: +options.temperature || 0.9,
                openAIApiKey: options.apiKey,
                streaming: true,
            },
            {
                basePath: options.baseUrl
            });


        const response = await chat.call(messages, {}, CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
                await res.write(token);
            }
        }));


        console.log("response:", response);
        await res.end(response);

    } catch (err) {
        console.error("Error:", err);
    }
}


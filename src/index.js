const {HumanMessage, SystemMessage} = require("langchain/schema");
const {res, req, clipboard, language} = require("enconvo/bridge");
const {CallbackManager} = require("langchain/callbacks");
const llm = require("enconvo/llm/llm");
const {SystemMessagePromptTemplate, ChatPromptTemplate} = require("langchain/prompts");


(async () => {
    // global.window.name = "nodejs";
    const {text, context, options} = req.body();
    console.log(`process begin...${JSON.stringify(req.body())}`)
    let translateText = text || (context.type === 'none' ? "" : context.value) || await clipboard.copy();
    console.log("begin fetch...")

    const sourceLang = await language.detect(translateText)

    let targetLang = "zh"
    if (sourceLang === 'zh-Hans') {
        targetLang = 'en'
    } else {
        targetLang = 'zh'
    }

    console.log(`sourceLang is ${JSON.stringify(sourceLang)}`)
    let isWord = language.isWord(sourceLang, translateText)
    console.log(`isWord is ${isWord}`)
    options.verbose = true
    let chat = llm(options)

    translateText = language.splitWord(translateText)

    isWord = language.isWord(sourceLang, translateText)
    console.log(`isWord is ${isWord}`)


    const templateText = `You are a {sourceLang}-{targetLang} dictionary. 
    Query Word: """{text}"""
    Result Formats:
    \`\`\`markdown
        [abbr of part of speech] {targetLang} Meaning]
    \`\`\`
    Result:`

    let messages

    if (isWord) {
        const template = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(templateText)
        ])
        messages = await template.formatMessages({
            text: translateText,
            sourceLang: sourceLang,
            targetLang: targetLang
        })

    } else {
        const template = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(`Translate the text to {targetLang}.
            Text: {text}
            Translation:`)
        ])

        messages = await template.formatMessages({text: translateText, targetLang: targetLang})
    }


    await chat.call(messages, {}, CallbackManager.fromHandlers({
        handleChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata) {
            res.write(`${translateText}\n\n`);
        },
        handleLLMNewToken(token, idx, runId, parentRunId, tags) {
            res.write(token);
        }
    }));
    res.end()
})();

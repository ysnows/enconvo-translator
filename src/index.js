const {res, req, clipboard, language} = require("enconvo/bridge");
const {CallbackManager} = require("langchain/callbacks");
const llm = require("enconvo/llm/llm");
const {SystemMessagePromptTemplate, ChatPromptTemplate} = require("langchain/prompts");


(async () => {
    // global.window.name = "nodejs";
    const {text, context, options} = req.body();
    console.log(`process begin...${JSON.stringify(req.body())}`)
    let translateText = text || (context === 'none' ? "" : context) || await clipboard.copy();
    console.log("begin fetch...")

    // 如果translateText中有换行符，需要添加> 符号
    const displayText = translateText.replace(/\n/g, "\n> ")
    res.write(`> ${displayText}\n\n`, 'context');

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
    options.stream = true
    let chat = llm(options)
    translateText = language.splitWord(translateText)

    isWord = language.isWord(sourceLang, translateText)
    console.log(`isWord is ${isWord}`)

    const templateText = `Act as a {sourceLang}-{targetLang} Dictionary for word most common two meaning with America phonetic symbols. 
    Query Word: """{text}"""
    
    Result Formats:
    \`\`\`markdown
        美: [phonetic symbols]
        
        [abbr of part of speech] {targetLang} Meaning]
    \`\`\`
    
    Example:
    \`\`\`markdown
        美: [dɪˈspleɪ]
        
        [n] 显示
        
        [v] 显示
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
        handleLLMNewToken(token, idx, runId, parentRunId, tags) {
            res.write(token);
        }
    }));
    res.end()
})();

const {ChatPromptTemplate, HumanMessagePromptTemplate} = require("langchain/prompts");
const {ChatOpenAI} = require("./lib/openai");

(async () => {
    global.window = {};
    // global.window.name = "nodejs";
    global.window.document = {};
    // var x = foo(1) + bar(1);
    const model = new ChatOpenAI({
        temperature: 0,
        streaming: false,
        modelName: "gpt-3.5-turbo-16k",
        openAIApiKey: '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',
        verbose: true
    }, {
        basePath: "https://ai.openreader.xyz/v1/",
    });

    // const model = new ChatOpenAI({
    //     temperature: 0,
    //     streaming: false,
    //     azureOpenAIApiKey: "ef256661ffdd4bb6b29144e1559aa91b", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    //     azureOpenAIApiInstanceName: "enconvo", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    //     azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    //     azureOpenAIApiVersion: "2023-07-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    //     verbose: true,
    // });

    // const model = new ChatAnthropic({
    //     temperature: 0,
    //     modelName: "claude-instant-1",
    //     anthropicApiKey: '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',
    //     verbose: true,
    // });

    const prompt = ChatPromptTemplate.fromPromptMessages([
        HumanMessagePromptTemplate.fromTemplate("{input}"),
    ])

    const messages = await prompt.formatMessages({input: global.text ?? "你好"})
    // console.log(`${JSON.stringify(messages)}`)
    const resp = await model.call(messages, {})
    console.log(`${resp.content}`)

    const executed = await $extension.execute({content: `${resp.content}`}, (text) => {
        console.log(`text: ${text}`);
    });

    completion(`${executed}`);

})().catch((err) => {
    console.log("error: " + err.message);
});



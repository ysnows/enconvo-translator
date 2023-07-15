const z = require('zod');
const {ChatPromptTemplate, HumanMessagePromptTemplate} = require("langchain/prompts");
const {DynamicStructuredTool} = require("langchain/tools");
const {ChatOpenAI} = require("./lib/openai");
const {ChatAnthropic} = require("./lib/anthropic");

(async () => {
    global.window = {};
    // global.window.name = "nodejs";
    global.window.document = {};
    // var x = foo(1) + bar(1);
    // const res = gamma(10);
    // console.log(`${res}`);
    // streamHandler(`${res}`);

    // const model = new ChatOpenAI({
    //     temperature: 0,
    //     streaming: false,
    //     modelName: "gpt-3.5-turbo-16k",
    //     openAIApiKey: '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',
    //     verbose: true
    // }, {
    //     basePath: "https://ai.openreader.xyz/v1/",
    // });

    const model = new ChatOpenAI({
        temperature: 0,
        streaming: false,
        azureOpenAIApiKey: "ef256661ffdd4bb6b29144e1559aa91b", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
        azureOpenAIApiInstanceName: "enconvo", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
        azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
        azureOpenAIApiVersion: "2023-07-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
        verbose: true,
    });

    // const model = new ChatAnthropic({
    //     temperature: 0,
    //     modelName: "claude-instant-1",
    //     anthropicApiKey: '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',
    //     verbose: true,
    // });

    const prompt = ChatPromptTemplate.fromPromptMessages([
        HumanMessagePromptTemplate.fromTemplate("{input}"),
    ])

    const tools = [
        new DynamicStructuredTool({
            name: "accounting_tool",
            description: "Accounting tool which can record a transaction (time , content , amount).",
            schema: z.object({
                content: z.string().describe("content of the transaction"),
                time: z.string().describe("time when the transaction happened, format: 2023-02-12 10:10:12"),
                amount: z.number().describe("amount of the transaction"),
            }),
            func: async ({}) => "add accounting success",
        }),
        new DynamicStructuredTool({
            name: "todo_tool",
            description: "Todo tool which can add todo item(location , time , content)",
            schema: z.object({
                content: z.string().describe("content of the todo item"),
                time: z.string().describe("time when the todo item happened, format: 2023-02-12 10:10:12"),
                location: z.string().describe("location of the todo item"),
            }),
            func: async ({}) => "add todo success",
        }),
    ]


    const messages = await prompt.formatMessages({input: global.text ?? "你好"})
    // console.log(`${JSON.stringify(messages)}`)
    const resp = await model.call(messages, {})
    console.log(`${resp.content}`)


    // const obj = z.object({
    //     content: z.string().describe("content of the transaction"),
    //     time: z.string().describe("time when the transaction happened, format: 2023-02-12 10:10:12"),
    //     amount: z.number().describe("amount of the transaction"),
    // });
    //
    // const json = zodToJsonSchema(obj)
    // console.log(`${JSON.stringify(json)}\n`);


    // const resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    // const jj = await resp.json()
    // console.log(`${JSON.stringify(jj)}`);


    // const $ = cheerio.load('<h2 class="title">Hello world</h2>');
    // $('h2.title').text('Hello there!');
    // $('h2').addClass('welcome');
    // console.log(`${$.html()}`)
    // $.html()
    //

    completion(`${resp.content}`);

})().catch((err) => {
    console.log("error: " + err.message);
});



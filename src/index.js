var foo = require('./foo.js');
var bar = require('./lib/bar.js');
var gamma = require('gamma');
var cheerio = require('cheerio');
var z = require('zod');
const {zodToJsonSchema} = require("zod-to-json-schema");
const {ChatPromptTemplate, HumanMessagePromptTemplate} = require("langchain/prompts");
const {DynamicStructuredTool} = require("langchain/tools");
const {EnChatAnthropic} = require("./lib/anthropic");
const {ChatOpenAI} = require("./lib/openai");

(async () => {
    global.window = {};
    // global.window.name = "nodejs";
    global.window.document = {};
    var x = foo(1) + bar(1);
    const res = gamma(10);
    console.log(`${res}`);
    // streamHandler(`${res}`);

    const model = new ChatOpenAI({
        temperature: 0,
        streaming: false,
        modelName: "gpt-3.5-turbo-16k",
        openAIApiKey: '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',
    });

    // const model = new EnChatAnthropic({
    //     temperature: 0,
    //     modelName: "claude-2",
    //     anthropicApiKey: '',
    //     verbose: true,
    // });
    //
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



    const messages = await prompt.formatMessages({input: global.text ?? "hello"})
    // console.log(`${JSON.stringify(messages)}`)
    const resp = await model.call(messages)
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

    completion(`${resp.content}`);

})().catch((err) => {
    console.log("error: " + err.message);
});



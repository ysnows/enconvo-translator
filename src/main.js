const {ChatPromptTemplate, HumanMessagePromptTemplate} = require("langchain/prompts");
// const {EnChatAnthropic} = require("./lib/anthropic");
//
//
// const model = new EnChatAnthropic({
//     temperature: 0,
//     modelName: "claude-2",
//     anthropicApiKey: '',
//     verbose: true,
// });



const prompt = ChatPromptTemplate.fromPromptMessages([
    HumanMessagePromptTemplate.fromTemplate("Hello, how are you?{input}"),
])

async function main() {

    const messages = await prompt.formatMessages({input: "haha."})
    console.log(`${JSON.stringify(messages)}`)
    // const resp = await model.call(messages)
    // console.log(`${resp.content}`)
    // completion(resp.content)
}

main().catch(console.error);






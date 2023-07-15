const {zodToJsonSchema} = require("zod-to-json-schema");

function formatToOpenAIFunction(tool) {
    return {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(tool.schema),
    };
}

module.exports = {
    formatToOpenAIFunction
}

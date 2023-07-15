const { Tiktoken, getEncodingNameForModel, } = require("js-tiktoken/lite");
const {AsyncCaller} = require("./async_caller");
const cache = {};
const caller = /* #__PURE__ */ new AsyncCaller({});
 async function getEncoding(encoding, options) {
    if (!(encoding in cache)) {
        cache[encoding] = caller
            .fetch(`https://tiktoken.pages.dev/js/${encoding}.json`, {
            signal: options?.signal,
        })
            .then((res) => res.json())
            .catch((e) => {
            delete cache[encoding];
            throw e;
        });
    }
    return new Tiktoken(await cache[encoding], options?.extendedSpecialTokens);
}
 async function encodingForModel(model, options) {
    return getEncoding(getEncodingNameForModel(model), options);
}

module.exports = {
    encodingForModel,
    getEncoding
}

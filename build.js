const browserify = require('browserify')
const fs = require('fs')
const tinyify = require('tinyify')

// 如果不存在，创建 ./dist
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

browserify(['./src/index.js'])
    .transform('babelify', {
        presets: ['@babel/preset-env'],
        global: true
    })
    .exclude('axios')
    .exclude('openai')
    .exclude('@anthropic-ai/sdk')
    .exclude('./few_shot.js')
    .exclude('./prompt.js')
    .exclude('./pipeline.js')
    .exclude('./template.js')
    .exclude('./serde.js')
    .exclude('./selectors/SemanticSimilarityExampleSelector.js')
    .exclude('./selectors/conditional.js')
    .exclude('./selectors/LengthBasedExampleSelector.js')
    // .plugin(tinyify, {
    //     env: {
    //         appid: 'enconvo.md5'
    //     }
    // })
    .bundle()
    .pipe(fs.createWriteStream('./dist/main.js'))

// copy main.yml to dist/main.yml
fs.copyFileSync('./main.yml', './dist/main.yml')

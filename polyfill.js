const fs = require("fs");

fs.readFile('./dist/main.js', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    const rngFunction = `function rng() {
  // If getRandomValues isn't available, use a simple PRNG
  if (!getRandomValues) {
    for (let i = 0; i < rnds8.length; i++) {
      // This is a very simple PRNG, you might want to use a better one
      rnds8[i] = Math.floor(Math.random() * 256);
    }
  } else {
    getRandomValues(rnds8);
  }
  return rnds8;
}`;

    const result = data.replace(/function rng\(\) \{[\s\S]*?return getRandomValues\(rnds8\);\n\}/, rngFunction);

    fs.writeFile('./dist/main.js', result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});

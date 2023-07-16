function getEnvironmentVariable(name) {
    return process.env[name] || '';
}

module.exports = {
    getEnvironmentVariable
}

module.exports = {
    NotImplement: details => new Error('NotImplement: ' + details),

    FileNotFound: details => new Error('FileNotFound: ' + details),

    VSyntaxError: details => new Error('VSyntaxError: ' + details)
}
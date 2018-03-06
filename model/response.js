const successResult = (messageResult) => {
    return {
        'status': 200,
        'messageResult': messageResult
    }
};

const errorResult = (errorResult, errorMessageResult) => {
    return {
        'status': 500,
        'errorResult': errorResult,
        'messageResult': errorMessageResult
    }
}

module.exports = {
    successResult,
    errorResult
}
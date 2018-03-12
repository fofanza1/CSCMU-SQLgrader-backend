const successResult = messageResult => {
  return {
    status: 200,
    messageResult: messageResult
  };
};

const errorResult = errorResult => {
  return {
    status: 500,
    errorResult: errorResult
  };
};

module.exports = {
  successResult,
  errorResult
};

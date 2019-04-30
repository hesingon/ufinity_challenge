const sendErrorResponse = (res, error, code) => {
    res.status(code | 400).send(error);
};

const sendErrorMessageResponse = (res, message, code) => {
    res.status(code | 400).send({message: message});
};

const sendDefaultErrorResponse = (res) => {
    res.status(400).send({message: "We can't interpret your request."});
};

module.exports = {
    sendErrorResponse,
    sendDefaultErrorResponse,
    sendErrorMessageResponse
};
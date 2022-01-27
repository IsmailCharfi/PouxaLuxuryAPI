const HttpError = require("./HttpError");

class FormError extends HttpError{
    constructor(code, message, rejectedInputs){
        super(code, message)
        this.rejectedInputs = rejectedInputs
    }
}

module.exports = FormError;

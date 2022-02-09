const HttpError = require("./HttpError");

class FormError extends HttpError{
    constructor(rejectedInputs){
        super(422, "les informations fournies ne sont pas valides")
        this.rejectedInputs = rejectedInputs
    }
}

module.exports = FormError;

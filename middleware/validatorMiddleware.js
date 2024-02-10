//2)middleware catch errors from rules if exist 
///finds validation errors in this request nd wraps them in an object with handy functions 
const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}

module.exports = validatorMiddleware
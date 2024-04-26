//2)middleware catch errors from rules if exist
///finds validation errors in this request nd wraps them in an object with handy functions
const { validationResult } = require('express-validator');
const {
  createPatientValidator,
} = require('../utils/validators/patientValidator');
const {
  createDermatologistValidator,
} = require('../utils/validators/dermatologistValidator');
const { createLabValidator } = require('../utils/validators/labValidator');

const validateMiddleware = async (req, res, next) => {
  let validationList;
  if (req.body.role === 'patient') {
    validationList = createPatientValidator;
  } else if (req.body.role === 'dermatologist') {
    validationList = createDermatologistValidator;
  } else if (req.body.role === 'lab') {
    validationList = createLabValidator;
  }

  await Promise.all(validationList.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const messages = [];
  const errorMsgs = errors.errors.map((error) => {
    const {msg} = error;
    messages.push(msg);
    return msg;
  });
  res.status(400).json({ errors: errors.array(), message: errorMsgs });
  return null;
};

module.exports = validateMiddleware;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');
const Patients = require('../models/patientModel');
const Dermatologists = require('../models/dermatologistModel');
const Labs = require('../models/labModel');
const Admins = require('../models/AdminModel');

// @desc    Signup
// @route   GET /api/v1/auth/signup/{ModelName}
// @access  Public

// const signup = async (Model, req, res) => {
//   // 1- Create user
//   const user = await Model.create(req.body);
//   // 2- Generate token
//   const token = createToken(user._id);

//   res.status(201).json({ data: user, token });
// };

// exports.checkRole = (req, res, next) => {
//   const query = req.body.role;

//   try {
//     switch (query) {
//       case 'patient':
//         signup(Patients, req, res);
//         break;
//       case 'dermatolgist':
//         uploadDermatologistImage();
//         resizeDermatologistImage();
//         createDermatologistValidator();
//         this.signup(Dermatologists);
//         break;
//       case 'lab':
//         uploadLabImage();
//         resizeLabImage();
//         createLabValidator();
//         signup(Labs);
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.signup = (Model) =>
  asyncHandler(async (req, res) => {
    // 1- Create user
    const user = await Model.create(req.body);
    // 2- Generate token
    const token = createToken(user._id);

    res.status(201).json({ data: user, token });
  });

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { email } = req.body;

  // Search in Patients and Dermatologists models concurrently
  const [patient, dermatologist, lab, admin] = await Promise.all([
    Patients.findOne({ email }).exec(),
    Dermatologists.findOne({ email }).exec(),
    Labs.findOne({ email }).exec(),
    Admins.findOne({ email }).exec(),
  ]);

  const isDoctor =
    dermatologist && (await bcrypt.compare(password, dermatologist.password));
  const isLab = lab && (await bcrypt.compare(password, lab.password));
  // Check if either patient or dermatologist exists and password is correct
  if (
    (patient && (await bcrypt.compare(password, patient.password))) ||
    isDoctor ||
    isLab ||
    (admin && (await bcrypt.compare(password, admin.password)))
  ) {
    if (
      (isDoctor && dermatologist.state === false) ||
      (isLab && lab.state === false)
    ) {
      return next(
        new ApiError(' Waiting until Admin approve your account', 401),
      );
    }
    
    // Login successful, generate token
    const user = patient || dermatologist || lab || admin;
    const token = createToken(user._id);

    // Delete password from response
    delete user._doc.password;

    // Send response to client
    res.status(200).json({ data: user, token });
  } else {
    // Neither patient nor dermatologist found, or password incorrect
    return next(new ApiError('Incorrect email or password 💥', 401));
  }
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login,Please login to get access this route',
        401,
      ),
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3) Check if user exists
  const [patient, dermatologist, lab, admin] = await Promise.all([
    Patients.findById(decoded.userId),
    Dermatologists.findById(decoded.userId),
    Labs.findById(decoded.userId),
    Admins.findById(decoded.userId),
  ]);
  const currentUser = patient || dermatologist || lab || admin;
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belongs to this token does no longer exist',
        401,
      ),
    );
  }
  // 4) Check if user change his password after token created

  if (currentUser) {
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10,
      );
      // Password changed after token created (Error)
      if (passChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'user recently changed their password. Please log in again.',
            401,
          ),
        );
      }
    }
    req.user = currentUser;
  } else {
    return next(
      new ApiError(
        'No valid user found for this token. Please log in again.',
        401,
      ),
    );
  }
  next();
});

// // @desc    Authorization (User Permissions)
// // [ "patient""dermatologist ,"lab"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // Access roles
    // Check if the user has the required role
    const { user } = req;
    if (!user || !roles.includes(user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403),
      );
    }
    next();
  });

// // @desc    Forgot password
// // @route   POST /api/v1/auth/forgotPassword
// // @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  // const user = await User.findOne({ email: req.body.email });
  // if (!user) {
  //   return next(
  //     new ApiError(`There is no user with that email ${req.body.email}`, 404),
  //   );
  // }
  const [patient, dermatologist, lab, admin] = await Promise.all([
    Patients.findOne({ email: req.body.email }),
    Dermatologists.findOne({ email: req.body.email }),
    Labs.findOne({ email: req.body.email }),
    Admins.findOne({ email: req.body.email }),
  ]);

  const user = patient || dermatologist || lab || admin;

  if (user) {
    // User found, handle accordingly...
  } else {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404),
    );
  }

  //   // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  //   // 3) Send the reset code via email
  const message = `Hi ${user.firstName},
      \n We received a request to reset the password on your DermaByte application Account.
      \n ${resetCode} \n Enter this code to complete the reset. 
      \n Thanks for helping us keep your account secure.
      \n The DermaByte application Team❤️`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
});

// // @desc    Verify password reset code
// // @route   POST /api/v1/auth/verifyResetCode
// // @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const [patient, dermatologist, lab, admin] = await Promise.all([
    Patients.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    }),
    Dermatologists.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    }),
    Labs.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    }),
    Admins.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    }),
  ]);

  const user = patient || dermatologist || lab || admin;

  console.log(user);
  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});

// // @desc    Reset password
// // @route   POST /api/v1/auth/resetPassword
// // @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const [patient, dermatologist, lab, admin] = await Promise.all([
    Patients.findOne({ email: req.body.email }),
    Dermatologists.findOne({ email: req.body.email }),
    Labs.findOne({ email: req.body.email }),
    Admins.findOne({ email: req.body.email }),
  ]);

  const user = patient || dermatologist || lab || admin;
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404),
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});

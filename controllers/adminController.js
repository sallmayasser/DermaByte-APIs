const asyncHandler = require('express-async-handler');
const Labs = require('../models/labModel');
const Dermatologist = require('../models/dermatologistModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');

exports.Approve = asyncHandler(async (req, res, next) => {
  // Execute both queries concurrently using Promise.all
  Promise.all([
    Labs.findByIdAndUpdate(req.body.id, { state: true }, { new: true }),
    Dermatologist.findByIdAndUpdate(
      req.body.id,
      { state: true },
      { new: true },
    ),
  ])
    .then(([foundLabs, foundDermatologist]) => {
      // Check if user is found in Labss
      if (foundLabs) {
        res.status(200).json({ data: foundLabs });
      }
      // Check if user is found in dermatologists
      else if (foundDermatologist) {
        res.status(200).json({ data: foundDermatologist });
      }
      // If user is not found in either model, return 404
      else {
        return Promise.reject(
          new ApiError(`No user found for this id ${req.body.id}`, 404),
        );
      }
    })
    .catch(next);
});
exports.Decline = asyncHandler(async (req, res, next) => {
  Promise.all([
    Labs.findByIdAndDelete(req.body.id),
    Dermatologist.findByIdAndDelete(req.body.id),
  ])
    .then(([foundLab, foundDermatologist]) => {
      let foundUser;
      if (foundLab) {
        foundUser = foundLab;
      } else if (foundDermatologist) {
        foundUser = foundDermatologist;
      } else {
        return Promise.reject(
          new ApiError(`No user found for this id ${req.body.id}`, 404),
        );
      }

      const message = `Dear ${foundUser.firstName},

\nI hope this message finds you well.

\n\nI am writing to inform you about the status of your recent account application with DermaByte . We regret to inform you that your application has been declined due to incomplete license information provided during the registration process.

\n\nAt DermaByte , we strive to maintain the highest standards of compliance and accuracy in our records. Unfortunately, the information provided in your license documentation did not meet our requirements for verification purposes.

\n\nWe understand the inconvenience this may cause and sincerely apologize for any frustration or disappointment this decision may have caused you. It is never our intention to inconvenience our applicants, but rather to ensure the integrity and security of our platform for all users.

\n\nWe value your interest in DermaByte  and encourage you to review and resubmit your application with the required documentation to complete the registration process. Should you have any questions or require further assistance, please do not hesitate to contact our support team at <dermabyte2024@gmail.com>.

\n\nOnce again, we apologize for any inconvenience this may have caused and thank you for your understanding and cooperation in this matter.

\n\nThank you for considering DermaByte . We look forward to the possibility of working with you in the future.

\n\nSincerely,
\nThe DermaByte application Team
 `;

      return sendEmail({
        email: foundUser.email,
        subject: 'Account Declined',
        message,
      })
        .then(() => {
          // Send success response after sending email and deleting user
          res.status(200).json({
            message:
              'You have declined this user and deleted successfully. An email notification has been sent.',
          });
        })
        .catch((error) => {
          // If there's an error sending email, handle it
          return Promise.reject(new ApiError('Failed to send email', 500));
        });
    })
    .catch((error) => {
      // If there's an error with database operation or sending email, send error response
      next(new ApiError('Server failed', 500));
    });
});

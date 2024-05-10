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
      let foundUser;
      // Check if user is found in Labs
      if (foundLabs) {
        foundUser = foundLabs;
        res.status(200).json({ data: foundLabs });
      }
      // Check if user is found in dermatologists
      else if (foundDermatologist) {
        foundUser = foundDermatologist; // Corrected assignment
        res.status(200).json({ data: foundDermatologist });
      }
      // If user is not found in either model, return 404
      else {
        return Promise.reject(
          new ApiError(`No user found for this id ${req.body.id}`, 404),
        );
      }

      const message = `Dear ${foundUser.firstName},

\nWe are pleased to inform you that your account has been approved. You are now a registered member of DermaByte. We would like to extend a warm welcome to our platform.

\nYour account details:
- Username: ${foundUser.firstName}
- Email: ${foundUser.email}

\nPlease feel free to log in to your account 

\nIf you have any questions or need assistance, please don't hesitate to contact our support team at <dermabyte2024@gmail.com>.

\nThank you for joining DermaByte. We look forward to serving you and providing you with a seamless experience.

\nBest regards,
The DermaByte application Team 

`;

      return sendEmail({
        email: foundUser.email,
        subject: 'Account Accepted',
        message,
      })
        .then(() => {
          // Send success response after sending email and updating user
          res.status(200).json({
            message:
              'You have accepted this user successfully. An email notification has been sent.',
          });
        })
        .catch((error) => {
          // If there's an error sending email, handle it
          return Promise.reject(new ApiError('Failed to send email', 500));
        });
    })
    .catch(next); // Catch any errors during the updates or email sending
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

\nI am writing to inform you about the status of your recent account application with DermaByte . We regret to inform you that your application has been declined due to incomplete license information provided during the registration process.

\nAt DermaByte , we strive to maintain the highest standards of compliance and accuracy in our records. Unfortunately, the information provided in your license documentation did not meet our requirements for verification purposes.

\nWe understand the inconvenience this may cause and sincerely apologize for any frustration or disappointment this decision may have caused you. It is never our intention to inconvenience our applicants, but rather to ensure the integrity and security of our platform for all users.

\nWe value your interest in DermaByte  and encourage you to review and resubmit your application with the required documentation to complete the registration process. Should you have any questions or require further assistance, please do not hesitate to contact our support team at <dermabyte2024@gmail.com>.

\nOnce again, we apologize for any inconvenience this may have caused and thank you for your understanding and cooperation in this matter.

\nThank you for considering DermaByte . We look forward to the possibility of working with you in the future.

\nSincerely,
The DermaByte application Team
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

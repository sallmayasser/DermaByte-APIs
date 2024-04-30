const stripe = require('stripe')(process.env.STRIPE_SECRET);
const moment = require('moment');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

const Dermatologist = require('../models/dermatologistModel');
// const { createReservation } = require("./doctorReservationController")
const { createMeeting } = require('./meetingController');
const doctorScheduleModel = require('../models/doctorScheduleModel');
const patientModel = require('../models/patientModel');
const Reservation = require('../models/doctorReservationModel');
const labReservationModel = require('../models/labReservationModel');
const testServiceModel = require('../models/testServiceModel');

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/reservationId
// @access  Protected/patient
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get reservation details based on reservationId
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const { date, dermatologist, scan, uploadedTest, patient, reviewed,symptoms } =
    req.body;

  const patientName = await patientModel.findById(patient).select('firstName');
  const patientid = await patientModel.findById(patient).select('id');
  const patientEmail = await patientModel.findById(patient).select('email');
  const pid = patientid.id;
  const dayindex = moment([
    moment(date).year(),
    moment(date).month(),
    moment(date).date(),
  ]).day();
  const dayName = weekdays[dayindex];
  // 2) Get price of reserved date from schedule details
  const Costs = await doctorScheduleModel
    .find({
      dermatologist: req.body.dermatologist,
      dayName: dayName,
    })
    .select('sessionCost');
  const Cost = Costs.map((price) => price.sessionCost)[0];
  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: patientName.firstName,
          },
          unit_amount: Cost * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/patients/Patient-reservation`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/dermatologists`,
    customer_email: patientEmail.email,
    client_reference_id: dermatologist,
    metadata: { date, scan, uploadedTest, reviewed, pid ,symptoms},
  });
  // 4) Send session as response
  res.status(200).json({ status: 'success', session });
});
exports.checkoutSessionLab = asyncHandler(async (req, res, next) => {
  // 1) Get reservation details based on reservationId

  const { date, lab, test, patient } = req.body;

  // Using Promise.all with map
  const promises = test.map(async (id) => {
    return await testServiceModel.findById(id).select('cost');
  });

  const carts = await Promise.all(promises);
  let totalPrice = 0;
  for (let i = 0; i < carts.length; i++) {
    totalPrice += carts[i].cost;
  }
  const testArray = JSON.stringify(test);
  const patientName = await patientModel.findById(patient).select('firstName');
  const patientid = await patientModel.findById(patient).select('id');
  const patientEmail = await patientModel.findById(patient).select('email');
  const pid = patientid.id;
  // 2) Get price from reservation details

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: patientName.firstName,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/patients/laboratory-reservation`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/labs`,
    customer_email: patientEmail.email,
    client_reference_id: lab,
    metadata: { date, lab, testArray, pid, },
  });

  // 4) Send session as response
  res.status(200).json({ status: 'success', session });
});

const createReservation = async (session) => {
  const date = session.metadata.date;
  const uploadedTest = session.metadata.uploadedTest;
  const patient = session.metadata.pid;
  const scan = session.metadata.scan;
  const dermatologist = session.client_reference_id;
  const reviewed = false;
  const symptoms = session.metadata.symptoms;

  const durations = await doctorScheduleModel
    .find({
      dermatologist: dermatologist,
    })
    .select('sessionTime');
  const duration = durations.map((time) => time.sessionTime);

  const meeting = await createMeeting('My Consultation', duration[0], date);

  const newDoc = await Reservation.create({
    date: date,
    dermatologist: dermatologist,
    patient: patient,
    scan: scan,
    uploadedTest: uploadedTest,
    meetingUrl: meeting.meeting_url,
    reviewed: reviewed,
    symptoms:symptoms
  });
  // Convert the document to JSON with virtuals
  // const responseData = newDoc.toJSON({ virtuals: true });
  // res.status(201).json({ data: responseData });
};
const createLabReservation = async (session) => {
  const testArray = session.metadata.testArray;
  const date = session.metadata.date;
  const test = JSON.parse(testArray);
  const patient = session.metadata.pid;
  const lab = session.client_reference_id;

  const newDoc = await labReservationModel.create({
    date: date,
    lab: lab,
    patient: patient,
    test: test,
  });
};
// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    // Determine if it's a dermatologist reservation or lab reservation
    if (event.data.object.metadata.scan !== undefined) {
      // Call createReservation function for dermatologist reservation
      await createReservation(event.data.object);
    } else {
      // Call createLabReservation function for lab reservation
      await createLabReservation(event.data.object);
    }
  }
  res.status(200).json({ received: true });
});

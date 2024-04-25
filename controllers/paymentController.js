const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

const Dermatologist = require('../models/dermatologistModel');
// const { createReservation } = require("./doctorReservationController")
const { createMeeting } = require('./meetingController');
const doctorScheduleModel = require('../models/doctorScheduleModel');
const patientModel = require('../models/patientModel');
const Reservation = require('../models/doctorReservationModel');

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/reservationId
// @access  Protected/patient
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    // 1) Get reservation details based on reservationId

    const { date, dermatologist, scan, uploadedTest, patient,reviewed } = req.body;

    // const patientid = req.user._id

    const Cost = await Dermatologist.findById(dermatologist).select('sessionCost');
    const patientName = await patientModel.findById(patient).select('firstName');
    const patientid = await patientModel.findById(patient).select('id');
    const patientEmail = await patientModel.findById(patient).select('email');
    const pid=patientid.id

    // 2) Get price from reservation details
    const totalPrice = Cost.sessionCost;
    
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
        success_url: `${req.protocol}://${req.get('host')}/api/v1/patients/Patient-reservation`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/v1/dermatologists`,
        customer_email: patientEmail.email,
        client_reference_id: dermatologist,
        metadata: {date,scan,uploadedTest,reviewed,pid }
    });

    // 4) Send session as response
    res.status(200).json({ status: 'success', session });
});


const createReservation = (async (session, res) => {

    const date = session.metadata.date
    const uploadedTest = session.metadata.uploadedTest
    // const reviewed =session.metadata.reviewed
    const patient = session.metadata.pid
    const scan = session.metadata.scan
    const dermatologist = session.client_reference_id
    const reviewed = false

    console.log(date)
    console.log(patient)
    console.log(scan)
    console.log(dermatologist)

    const durations = await doctorScheduleModel
        .find({
            dermatologist: dermatologist,
        })
        .select('sessionTime');
    const duration = durations.map((time) => time.sessionTime);

    const meeting = await createMeeting(
        'My Consultation',
        duration[0],
        date,
    );

    const newDoc = await Reservation.create({
        date: date,
        dermatologist: dermatologist,
        patient: patient,
        scan: scan,
        uploadedTest: uploadedTest,
        meetingUrl: meeting.meeting_url,
        reviewed: reviewed,
    });
    // Convert the document to JSON with virtuals
    const responseData = newDoc.toJSON({ virtuals: true });
    res.status(201).json({ data: responseData });
});
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
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);

    }
    if (event.type === 'checkout.session.completed') {
        //  Create reservation
        console.log("enter condition")
        createReservation(event.data.object);

    }


    res.status(200).json({ received: true });
});
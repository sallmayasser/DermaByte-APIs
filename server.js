const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');
const dbConnection = require('./Configs/Database');

dotenv.config({ path: 'config.env' });

const { webhookCheckout } = require('./controllers/paymentController');

//routes
const dermatologistRoute = require('./Routes/dermatologistRoute');
const labRoute = require('./Routes/labRoute');
const patientRoute = require('./Routes/patientRoutes');
const doctorReservationRoute = require('./Routes/doctorReservationRoutes');
const labReservationRoute = require('./Routes/labReservationRoutes');
const testServiceRoute = require('./Routes/testServiceRoute');
const reportRoute = require('./Routes/reportRoute');
const resultRoute = require('./Routes/resultRoute');
const scanRoute = require('./Routes/scansRoutes');
const requestedTestsRoute = require('./Routes/requestedTestRoutes');
const authRoute = require('./Routes/authRoute');
const adminRoute = require('./Routes/adminRoute');
const scheduleRoute = require('./Routes/scheduleRoute');
const reviewRoute = require('./Routes/reviewRoute');
const paymentRoute = require('./Routes/paymentRoute');

// connect with db
dbConnection();

///express app
const app = express();
// Create MongoStore instance
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoStore = MongoStore.create({
  mongoUrl: process.env.DB_URI,
  collectionName: 'sessions',
});

/////middleware
app.use(cors());
app.use(compression());
//checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  }),
);
app.use(express.static(path.join(__dirname, 'uploads')));
const authenticateJWT = (req, res, next) => {
  const token = req.cookies['jwt'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // return res.sendStatus(403); // Forbidden
        return next(new ApiError('Session ended , Please login again ', 403));
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

if (process.env.Node_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`node:${process.env.Node_ENV}`);
}

////Mount Routes
app.options('*', cors());

app.use('/api/v1/dermatologists', dermatologistRoute);
app.use('/api/v1/labs', labRoute);
app.use('/api/v1/patients', patientRoute);
app.use('/api/v1/Dermatologist-reservation', doctorReservationRoute);
app.use('/api/v1/laboratories-reservations', labReservationRoute);
app.use('/api/v1/testServices', testServiceRoute);
app.use('/api/v1/reports', reportRoute);
app.use('/api/v1/results', resultRoute);
app.use('/api/v1/scans', scanRoute);
app.use('/api/v1/requested-tests', requestedTestsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/schedules', scheduleRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', paymentRoute);
app.all('*', (req, res, next) => {
  next(new ApiError(`can't find this route:${req.originalUrl}`, 400));
});

// global error handling middelware for express
app.use(globalError);

//handle rejections outside express
process.on('unhandleRejection', (err) => {
  console.error(`unhandleRejection Errors:${err.name}|${err.message}`);
  server.close(() => {
    console.log('shuting  down....');
    process.exit(1);
  });
});

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

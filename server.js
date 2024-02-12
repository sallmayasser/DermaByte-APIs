const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require('./Configs/Database');

dotenv.config({ path: 'config.env' });


//routes
const patientRoute = require('./Routes/patientRoutes');


// connect with db 
dbConnection();

///express app
const app = express();

/////middleware
app.use(express.json());
if (process.env.Node_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`node:${process.env.Node_ENV}`);
}

////Mount Routes
app.use('/api/v1/patients', patientRoute)


app.all("*", (req, res, next) => {
    next(new ApiError(`can't find this route:${req.originalUrl}`, 400));
});

//global error handling middelware for express
app.use(globalError);

//handle rejections outside express
process.on("unhandleRejection", (err) => {
    console.error(`unhandleRejection Errors:${err.name}|${err.message}`);
    server.close(() => {
        console.log('shuting  down....')
        process.exit(1);
    });
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});


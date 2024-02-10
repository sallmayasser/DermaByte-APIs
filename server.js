const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// const mongoose = require('mongoose');
dotenv.config({ path: 'config.env' });
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require('./Configs/Database');
//routes
// const categoryRoute = require('./routes/categoryRoute');
// const subCategoryRoute = require('./routes/subCategoryRoute');
// const brandRoute=require('./routes/brandRoute');
// const productRoute=require('./routes/productRoute');

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
// app.use('/api/v1/categories', categoryRoute)
// app.use('/api/v1/subcategories', subCategoryRoute)
// app.use('/api/v1/brands', brandRoute)
// app.use('/api/v1/products', productRoute)
// app.all("*", (req, res, next) => {

//     next(new ApiError(`can't find this route:${req.originalUrl}`, 400));
// });

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


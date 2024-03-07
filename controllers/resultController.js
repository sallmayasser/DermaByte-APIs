const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler'); 
const Result = require('../models/resultModel')
const factory = require('./handlersFactory');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');



exports.uploadTestResultImages = uploadMixOfImages([{ name: 'testResult', maxCount: 30 }]);

exports.resizeTestResultImages = asyncHandler(async (req, res, next) => {
    //2)image processing for images
    if (req.files.testResult) {
        req.body.testResult = [];
        await Promise.all(req.files.testResult.map(async (img, index) => {
            const imageName = `Result-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
            await sharp(img.buffer)
                .resize(600, 600)
                .toFormat("jpeg")
                .jpeg({ quality: 95 })
                .toFile(`uploads/Results/${imageName}`);
            // save image into our database
            req.body.testResult.push(imageName);
        })
        );
        
    }
    next();
});
exports.getResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result);
exports.createResult = factory.createOne(Result);
exports.updateResult = factory.updateOne(Result);
exports.deleteResult = factory.deleteOne(Result);
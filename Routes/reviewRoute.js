const express = require('express');

const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
      deleteReviewValidator,
} = require('../utils/validators/reviewValidator');
const getLoggedUserData =require('../controllers/handlersFactory')
const {
    getReview,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    //   createFilterObj,
    setPatientIdToBody,
} = require('../controllers/reviewController');

const authService = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        // createFilterObj,
        getReviews)
        
    .post(
        authService.protect,
        authService.allowedTo('patient','admin'),
        setPatientIdToBody,
        createReviewValidator,
        createReview
    );
router
    .route('/:id')
    .get(
        getReviewValidator,
        getReview)
    .put(
        authService.protect,
        authService.allowedTo('patient'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        authService.protect,
        authService.allowedTo('patient', 'admin'),
        deleteReviewValidator,
        deleteReview
    );

module.exports = router;
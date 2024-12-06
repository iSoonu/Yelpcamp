const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const reviews = require('../controllers/reviews');
const ExpressError = require("../utils/ExpressError");
const { validateReview,isLoggedin,isReviewAuthor } = require('../middleware');
const Campground = require("../models/campground");
const Review = require('../models/review');


router.post('/',isLoggedin,validateReview, catchAsync(reviews.addReview));
  
router.delete('/:reviewId',isLoggedin,isReviewAuthor, catchAsync(reviews.deleteReview));

  module.exports = router;

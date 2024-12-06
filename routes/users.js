const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');


router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.registerUser));


router.get('/login', users.renderLogin);

router.post('/login' ,passport.authenticate('local', {failureFlash:true,failureRedirect: '/login'}),users.userLogin);


router.get('/logout',users.userLogout);


module.exports = router;

const Joi = require('joi');
const { number } = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});
const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require("../utils/catchAsync");

const { isLoggedin, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require("../models/campground");


router.get("/",catchAsync(campgrounds.index));

router.get("/new", isLoggedin, campgrounds.renderCamp);
    
router.post('/', isLoggedin, upload.array('image',10), validateCampground, catchAsync(campgrounds.newCamp));

router.get('/:id', catchAsync(campgrounds.showCamp));

router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(campgrounds.renderEditCamp));

router.put('/:id', isLoggedin, isAuthor, upload.array('image',10), validateCampground, catchAsync(campgrounds.updateCamp));

router.delete('/:id', isLoggedin, isAuthor, catchAsync(campgrounds.deleteCamp));





module.exports = router;

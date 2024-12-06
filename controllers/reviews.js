const Review = require('../models/review');
const Campground = require("../models/campground");

module.exports.addReview = async (req,res) => {
    const { id } = req.params;
    const reviewCamp =  await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    reviewCamp.reviews.push(review);
    await review.save();
    await reviewCamp.save();
    req.flash('success' , "Created new review");
    res.redirect(`/campgrounds/${reviewCamp._id}`);
  }

module.exports.deleteReview = async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull :{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully Deleted the Review");
    res.redirect(`/campgrounds/${id}`);
  }


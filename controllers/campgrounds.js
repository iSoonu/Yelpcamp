const Campground = require("../models/campground");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const campground = await Campground.find({});
  res.render("campground/index", { campground });
};


module.exports.renderCamp = (req, res) => {
  res.render("campground/new");
};



module.exports.newCamp = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.features[0].geometry;
  console.log(newCamp);
  newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  newCamp.author = req.user._id;
  await newCamp.save();
  console.log(newCamp.images);
  req.flash("success", "Successfully added new camp");
  res.redirect(`/campgrounds/${newCamp._id}`);
};



module.exports.showCamp = async (req, res, next) => {
  const campId = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campId) {
    req.flash("error", "Campground Not Found");
    return res.redirect("/campgrounds");
  }
  res.render("campground/show", { campId });
};



module.exports.renderEditCamp = async (req, res, next) => {
  const { id } = req.params;
  const editCampId = await Campground.findById(req.params.id);
  if (!editCampId) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }
  res.render("campground/edit", { editCampId });
};



module.exports.updateCamp = async (req, res, next) => {
  const { id } = req.params;
  const updateCamp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  updateCamp.geometry = geoData.features[0].geometry;
  const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
  updateCamp.images.push(...img);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updateCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  await updateCamp.save();
  req.flash("success", "Successfully Updated");
  res.redirect(`/campgrounds/${updateCamp._id}`);
};



module.exports.deleteCamp = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted the Campground");
  res.redirect("/campgrounds");
};



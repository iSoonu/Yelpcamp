const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('user/register');
}


module.exports.registerUser = async(req,res,next) => {
    try{
    const { email,username,password} = req.body;
    const user = new User({ email , username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', `Welcome to the Campground ${req.user.username}`);
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}


module.exports.renderLogin = (req,res) => {
    res.render('user/login');
}


module.exports.userLogin = (req,res) => {
    req.flash('success', `Welcome Back ${req.user.username}`);
    res.redirect('/campgrounds');
}


module.exports.userLogout =  (req,res,next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}


var express=require('express');
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get("/",(req,res)=>{
	res.render("landing");
});




//================================================
//AUTH ROUTES
//================================================

//SHOW REGISTRATION FORM
router.get("/register",(req,res)=>{
	res.render("register");
});

//HANDLE SIGN-UP LOGIC
router.post("/register",(req,res)=>{
	var newUser=new User({username: req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
          req.flash("error", err.message);
          return res.redirect("/register");
}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Welcome to Yelpcamp "+user.username);
			res.redirect("/campgrounds");
		});
	});
});

//SHOW LOGIN FORM
router.get("/login",(req,res)=>{
	res.render("login");
});

//login logic here
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}),(req,res)=>{
	
});

//=======================
//LOGOUT ROUTE
//=======================

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","You are successfully logged out!");
	res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		console.log("yes!!!");
		return next();
	}
	res.redirect("/login");
}


module.exports=router;
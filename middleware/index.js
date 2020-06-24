var express=require('express');
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareobj={};
middlewareobj.checkCampgroundOwnership=function (req,res,next){
	if(req.isAuthenticated())
		{Campground.findById(req.params.id,(err,foundcamp)=>{
			if(err || !foundcamp)
				{req.flash("error","Campground not found");
				res.redirect("back");}
			else
				{
					if(foundcamp.author.id.equals(req.user._id))
						next();
						
					else
					{req.flash("error","You don't have permission to do that");
						res.redirect("back");}
				}
		})
}else
{req.flash("error","You needd to be logged in to do that");
	res.redirect("back");}
	
}

middlewareobj.checkCommentOwnership=function (req,res,next){
	if(req.isAuthenticated())
		{Comment.findById(req.params.comment_id,(err,foundcomment)=>{
			if(err || !foundcomment)
				{req.flash("error","Comment not found")
				res.redirect("back");}
			else
				{
					if(foundcomment.author.id.equals(req.user._id))
						next();
						
					else
					{req.flash("error","You don't have permission to do that");
						res.redirect("back");}
				}
		})
}else
{req.flash("error","You need to be loggged in first");
	res.redirect("back");}
	
}

middlewareobj.isLoggedIn=function (req,res,next){
	if(req.isAuthenticated()){
		console.log("yes!!!");
		return next();
	}
	req.flash("error","You need to be logged in first");
	res.redirect("/login");
}

module.exports=middlewareobj;
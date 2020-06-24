var express=require('express');
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareobj=require("../middleware");
//================================//
// COMMENTS ROUTE
//================================//
 //NEW
router.get("/new",middlewareobj.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,found)=>{
		if(err)
			console.log(err);
		else{
	         
			res.render("comments/new",{campground: found});
		}
	});
	
});

//CREATE
router.post("/",middlewareobj.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,found)=>{
		if(err)
		{console.log(err);
		 res.redirect("/campgrounds");}
		else{
			 // console.log(req.user);
			Comment.create(req.body.c,(err,newlycreatedcom)=>{
				if(err){
					req.flash("error","Something went wrong ");
					console.log(err);
				}
				
				else
				{ 
				    newlycreatedcom.author.id=req.user._id;
					newlycreatedcom.author.username=req.user.username;
					newlycreatedcom.save();
					// console.log(newlycreatedcom);
				found.comments.push(newlycreatedcom);
					found.save();
					req.flash("success","Successfully added the comment");
					res.redirect("/campgrounds/"+found._id);
				}
	});
		}
	});
	
});

//COMMENTS EDIT
router.get("/:comment_id/edit",middlewareobj.checkCommentOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundcampground)=>{
		if(err || !foundcampground)
			{
				req.flash("error","Campground not found");
				res.redirect('back');
			}
		Comment.findById(req.params.comment_id,(err,foundcomment)=>{
		if(err)
			res.redirect("back");
		else
		res.render("./comments/edit",{campground_id: req.params.id,comment: foundcomment});	
	});
	});
	
	
});

//COMMENTS UPDATE
router.put("/:comment_id",middlewareobj.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.c,(err,updatedcmt)=>{
		if(err)
			res.redirect("back");
		else
			res.redirect("/campgrounds/"+req.params.id);
	});
	
});

//COMMENT DELETE
router.delete("/:comment_id",middlewareobj.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err)
			res.redirect("back");
		else
		{req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);}
	});
});



module.exports=router;

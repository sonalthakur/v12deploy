var express=require('express');
var router=express.Router();
var Campground=require("../models/campground");
var middlewareobj=require("../middleware");

//index route
router.get("/",(req,res)=>{
	Campground.find({},(err,newcampsadded)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{camp: newcampsadded});
		}
	});

	
	
});

//create route + add new campground to db
router.post("/",middlewareobj.isLoggedIn,(req,res)=>{
	//get data from form and add to campgrounds array
	const name=req.body.name;
	const img=req.body.img;
	const d=req.body.desc;
	const author= {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground={name: name,image: img,description: d,author: author};
	// camp.push(newCampground);
	//create a new campground and save to DB
	Campground.create(newCampground,(err,newlycreatedcamp)=>{
		if(err)
			{
				console.log(err);
			}
		else{
			// console.log(newlycreatedcamp);
			res.redirect("/campgrounds");
		}
			
			
	});
	
});

//New route
router.get("/new",middlewareobj.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,found)=>{
		if(err || !found)
			{req.flash("error","Campground not found");
			console.log(err);}
		else
			// {console.log(found);
			res.render("campgrounds/show",{cg: found});
			
	});
	
});

//EDIT CAMPGROUNDS
router.get("/:id/edit",middlewareobj.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundcamp)=>{
		res.render("campgrounds/edit",{campground: foundcamp});

	// Campground.findById(req.params.id,(err,foundcamp)=>{
	
		// if(err){
		// 	console.log(err);
		// 	res.redirect("/campgrounds");
		// }
			// res.render("campgrounds/edit",{campground: foundcamp});
	})
	;
});


//UPDATE CAMPGROUNDS
router.put("/:id",middlewareobj.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.c,(err,updated)=>{
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds/"+req.params.id);
	});
});

//DELETE ROUTE

router.delete("/:id",middlewareobj.checkCampgroundOwnership,async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});





module.exports=router;

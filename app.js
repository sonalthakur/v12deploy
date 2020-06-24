var    express    =require('express'),
	  app        =express(),
	  bodyParser =require('body-parser'),
	  mongoose   =require('mongoose'),
	  passport   =require('passport'),
	  LocalStrategy=require('passport-local'),
	methodOverride=require('method-override'),
	  Campground =require('./models/campground'),
	  Comment   =require("./models/comment"),
	  User      =require("./models/user"),
	flash       =require("connect-flash"),
	  seedDb    =require("./seed");

var   commentsRouter   =require("./routes/comments"),
	  campgroundsRouter=require("./routes/campgrounds"),
	  indexRouter      =require("./routes/index");


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_campdb_v12", {useNewUrlParser: true });
app.set("view engine","ejs");
// app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(flash());

// seedDb();

//=======================================
//PASSPORT CONFIG
//=======================================
app.use(require("express-session")({
	secret: "this is a secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//model Campground has funtion methods on it.

 // Campground.create(
 // {    // pass in the object we want to create
 // name: "Salmon Creek",
 // 		image: "https://www.oregonhikers.org/w/images/thumb/e/ec/Mt._Hood%2C_Salmon_Creek_Greenway.jpg/400px-Mt._Hood%2C_Salmon_Creek_Greenway.jpg",
 // description: "Known for its parks and trails, Salmon Creek provides a scenic escape from the city and serves as the gateway to North County."
 // 	},(err, campground)=>{
 // if(err){
 // 			console.log(err);
 // 	} else{
 // 	 console.log("Newly create campground is: ");
 // 	 console.log(campground);
 //       }
 // });

	// const camp=[
	// 	{name: "salmon creek", image: "https://www.oregonhikers.org/w/images/thumb/e/ec/Mt._Hood%2C_Salmon_Creek_Greenway.jpg/400px-Mt._Hood%2C_Salmon_Creek_Greenway.jpg"},
	// 	{name: "PineHills Nature camp", image: "https://media-cdn.tripadvisor.com/media/photo-s/17/a3/46/b5/pinehills-nature-camp.jpg"},
	// 	{name: "Parvati Wood Camps", image: "https://media-cdn.tripadvisor.com/media/photo-s/16/33/a3/ef/snow-fall-at-parvati.jpg"},
	// 	{name: "alora camp", image: "https://ecobnb.com/blog/app/uploads/sites/3/2016/08/a532a47f23dfad7b867b6b9fddc18b67b4693321.jpeg"},
	// 	{name: "Granite Hills", image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/camping-quotes-1556677391.jpg?crop=0.588xw:1.00xh;0.157xw,0&resize=640:*"},
	// 	{name: "Alasca camp", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"},
	// 	{name: "Elephant forest", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
	// 	{name: "Solang Hills", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
	// ]

app.use(indexRouter);
app.use("/campgrounds",campgroundsRouter);
app.use("/campgrounds/:id/comments",commentsRouter);


app.listen(process.env.PORT, process.env.IP);
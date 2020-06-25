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


// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/yelp_campdb_v12", {useNewUrlParser: true });
mongoose.connect("mongodb+srv://sonal:longwaytogo123@cluster0-2qbob.mongodb.net/yelp_campdb_v12?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true}).then(()=>{
	console.log("All set!");}).catch(err=>{
	console.log('Err:',err.message)
});


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


app.use(indexRouter);
app.use("/campgrounds",campgroundsRouter);
app.use("/campgrounds/:id/comments",commentsRouter);


var port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("Server Has Started!");});
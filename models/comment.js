var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
	text: String,
	author: {// author is now an onject with 2 properties id and author
		id:{
			 type: mongoose.Schema.Types.ObjectId,
		     ref: "User"
		},
		username: String
	}
});

var Comment=mongoose.model("Comment",commentSchema);
module.exports=Comment;
	

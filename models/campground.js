var mongoose=require("mongoose");

// SCHEMA SETUP
const campSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {// author is now an onject with 2 properties id and author
		id:{
			 type: mongoose.Schema.Types.ObjectId,
		     ref: "User"
		},
		username: String
	},
	 comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

const Comment = require('./comment');
campSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});
const Campground = mongoose.model("Campground", campSchema);

module.exports=Campground;
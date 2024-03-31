const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;

const commentSchema = new Schema({
  post_parent: { type: mongoose.Types.ObjectId, ref: "Post" },
  comment_parent: { type: mongoose.Types.ObjectId, ref: "Comment" },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  content: { type: String, minLenght: 5, required: true },
  published_date: { type: Date, default: Date.now },
});

commentSchema.virtual("published_date_formatted").get(function () {
  return DateTime.fromJSDate(this.published_date, {
    zone: "utc",
  }).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Comment", commentSchema);

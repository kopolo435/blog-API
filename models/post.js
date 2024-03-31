const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String, maxLength: 30, required: true },
  content: { type: String, minLength: 5, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  published_date: { type: Date },
  last_edit: { type: Date, default: Date.now },
  is_published: { type: Boolean, required: true },
});

postSchema.virtual("published_date_formatted").get(function () {
  return DateTime.fromJSDate(this.published_date, {
    zone: "utc",
  }).toLocaleString(DateTime.DATE_MED);
});

postSchema.virtual("last_edit_formatted").get(function () {
  return DateTime.fromJSDate(this.last_edit, { zone: "utc" }).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Post", postSchema);

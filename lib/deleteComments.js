const Comment = require("../models/comment");

async function deleteComments(commentsArray) {
  if (commentsArray.length === 0) {
    return true;
  }
  const currentComment = commentsArray.pop();
  const currentCommentReplies = await Comment.find({
    comment_parent: currentComment.id,
  }).exec();
  await Promise.all([
    deleteComments(commentsArray),
    deleteComments(currentCommentReplies),
    Comment.deleteOne({ _id: currentComment.id }),
  ]);
  return true;
}

module.exports = deleteComments;

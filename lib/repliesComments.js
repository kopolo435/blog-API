const Comment = require("../models/comment");

async function getCommentReplies(commentsArray) {
  if (commentsArray.length === 0) {
    return [];
  }
  if (commentsArray.length === 1) {
    const currentComment = commentsArray.pop();
    const replies = await Comment.find({
      comment_parent: currentComment.id,
    }).exec();
    const repliesWithChildren = await getCommentReplies(replies);
    return [{ ...currentComment._doc, children: repliesWithChildren }];
  }

  const currentComment = commentsArray.pop();
  const currentCommentWithChildren = await getCommentReplies([currentComment]);
  const siblingComments = await getCommentReplies(commentsArray);
  return currentCommentWithChildren.concat(siblingComments);
}

module.exports = getCommentReplies;

const NotificationModel = require("../model/NotificationModel.js");

const createFriendRequestNotification = async (recieverid, senderid,status) => {
  try {
    console.log("function called ",recieverid,senderid)
    return await NotificationModel.create({
      reciever: recieverid,
      type: "friendRequest",
      sender: senderid,
      status:status
    });
  } catch (error) {
    console.log(error);
  }
};

const createPostLikeNotification = async (recieverid, postid,senderid) => {
  try {
    return await NotificationModel.create({
      reciever: recieverid,
      type: "like",
      post: postid,
      sender:senderid
    });
  } catch (error) {
    console.log(error);
  }
};

const createPostCommentNotification = async (recieverid, postid,senderid) => {
  try {
    return await NotificationModel.create({
      reciever: recieverid,
      type: "comment",
      post: postid,
      sender:senderid
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createFriendRequestNotification,
  createPostCommentNotification,
  createPostLikeNotification,
};

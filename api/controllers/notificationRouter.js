const NotificationModel = require("../model/NotificationModel");

const getnotification = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ reciever: req.user.id }).sort({ createdAt: -1 }).populate('sender','username photoUrl');
    
    const formattedNotifications = notifications.map((notification) => {
        
      const senderName = notification.sender.username;
      const notificationType = notification.type;
      let message = "";

      if (notificationType === "like") {
        message = `${senderName} liked your photo.`;
      } else if (notificationType === "comment") {
        message = `${senderName} commented on your photo.`;
      }
      else if (notificationType==="friendRequest"){
        if(notification.status==="friend"){
        message=`${senderName} is now your friend.`
        }
        else{
        message=`${senderName} sent you friend request.`;
        }
      }

      return {
        _id: notification._id,
        message,
        read: notification.read,
        createdAt: notification.createdAt,
        senderid:notification.sender._id,
        senderphoto:notification.sender.photoUrl,
        notificationType,
        reqStatus:notification.status,
        post:notification.post
      };
    });


    res.status(200).json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
};

module.exports = { getnotification };

const UserModel = require("../model/UserModel");
const PostModel = require("../model/PostModel.js");
const MessageModel = require("../model/MessageModel.js");
const NotificationModel = require("../model/NotificationModel.js");
const {
  createFriendRequestNotification,
} = require("../helper/notification.js");
const FriendRequestModel = require("../model/FriendRequestModel");
const { getIo } = require("../socket.js");

const addFriend = async (req, res) => {
  try {
    const { friendid, notificationId } = req.params;
    const userid = req.user.id;

    const friend = await UserModel.findOne({ _id: friendid });
    const user = await UserModel.findOne({ _id: userid });
    if (!user || !friendid) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.friends.includes(friendid)) {
      return res.status(400).json({ message: "User is already a friend" });
    }
    friend.friends.push(userid);
    await friend.save();
    user.friends.push(friendid);
    await user.save();
    const notification = await NotificationModel.findOne({
      _id: notificationId,
    });
    notification.status = "friend";
    await notification.save();
    res.status(200).json({ message: "friend added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { friendid } = req.params;
    const userid = req.user.id;

    const friend = await UserModel.findOne({ _id: friendid });
    const user = await UserModel.findOne({ _id: userid });
    if (!user || !friendid) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!user.friends.includes(friendid)) {
      return res.status(400).json({ message: "User is not a friend" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendid);
    await user.save();

    friend.friends = friend.friends.filter((id) => id.toString() !== userid);
    await friend.save();

    res.status(200).json({ message: "friend removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const io = getIo();
  try {
    if (!senderId || !receiverId) {
      return res.status(404).json({ message: "friend not provided" });
    }
    const existingRequest = await FriendRequestModel.findOne({
      sender: senderId,
      receiver: receiverId,
      status: { $ne: "rejected" }, // Ensure not checking rejected requests
    });
    if (existingRequest) {
      return res.status(400).json({ message: "friend request already sent" });
    }
    const friendRequest = await FriendRequestModel.create({
      sender: senderId,
      receiver: receiverId,
    });

    // Create a notification for the receiver
    await createFriendRequestNotification(receiverId, senderId, "Accept");
    io.emit("friendrequest", { senderId, receiverId });

    res.status(201).json({ message: "Friend request sent", friendRequest });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find({
      friends: { $nin: [req.user.id] },isVerified: true
    }).select("username photoUrl fullname");
    const data = user.filter((user) => user._id != req.user.id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFriend = async (req, res) => {
  try {
    const friends = await UserModel.find({
      friends: { $in: [req.user.id] },
    }).select("username photoUrl fullname");
    const friendsWithLatestMessage = await Promise.all(
      friends.map(async (friend) => {
        const latestMessage = await MessageModel.findOne({
          $or: [
            { sender: req.user.id, receiver: friend._id },
            { sender: friend._id, receiver: req.user.id },
          ],
        })
          .sort({ timestamp: -1 })
          .limit(1)
          .select("content timestamp");

        return {
          ...friend._doc, // Use `_doc` to get the raw document data
          latestMessage,
        };
      })
    );

    res.status(200).json(friendsWithLatestMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mesage: "internal server error" });
  }
};

const singleUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await UserModel.findOne({ _id: userid })
      .select("photoUrl fullname friends username")
      .populate("friends");
    const post = await PostModel.find({ userId: userid }).sort({
      createdAt: -1,
    });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    res.status(200).json({ userinfo: user, userpost: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal sever error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const user = await UserModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "USer not found" });
    }
    user.photoUrl = photoUrl;
    await user.save();
    res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchUser = async (req, res) => {
  try {
    const{query}=req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
 // Create a regular expression that matches the start of the string or the whole word

    const regex = new RegExp(`^${query}`, 'i');
    const users = await UserModel.find({
        $or: [
          { username: regex},
          { fullname: regex },
        ],
      }).select('username fullname photoUrl');
    if(users.length<=0) 
    {
        return res.status(404).json({message:"no user found"})
    }
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addFriend,
  removeFriend,
  getFriend,
  sendFriendRequest,
  getAllUsers,
  singleUser,
  updateUser,
  searchUser
};

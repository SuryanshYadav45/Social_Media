const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.js");
const {
  addFriend,
  removeFriend,
  sendFriendRequest,
  getAllUsers,
  singleUser,
  getFriend,
  updateUser,
  searchUser
} = require("../controllers/userController.js");

router.get("/adduser/:friendid/:notificationId", authenticateToken, addFriend);
router.post("/removeruser/:friendid", authenticateToken, removeFriend);
router.post("/sendrequest", authenticateToken, sendFriendRequest);
router.get('/getusers',authenticateToken,getAllUsers)
router.get('/getFriend',authenticateToken,getFriend)
router.get('/userinfo/:userid',authenticateToken,singleUser)
router.post('/updateuser',authenticateToken,updateUser)
router.get('/searchuser',authenticateToken,searchUser)
module.exports = router;

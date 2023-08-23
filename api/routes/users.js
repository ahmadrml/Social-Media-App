const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//DELETE User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//GET User
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    if (user) res.status(200).json(other);
    else res.status(404).json("No Account");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Search Bar
router.get("/search", async (req, res) => {
  try {
    const username = req.query.username;
    const filteredUsers = await User.find(
      {username: { $regex: `^${username}`, $options: "i" }},
      {_id:0 , password: 0}
    );
    if (filteredUsers) res.status(200).json(filteredUsers);
    else res.status(404).json("No Account");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePic } = friend;
      friendList.push({ _id, username, profilePic });
    });
    res.status(200).json(friendList);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.body.userId);
      const currentUser = await User.findById(req.params.id);
      if (userToFollow && currentUser) {
        if (!currentUser.following.includes(req.body.userId)) {
          await currentUser.updateOne({
            $push: { following: req.body.userId },
          });
          await userToFollow.updateOne({ $push: { followers: req.params.id } });
          res.status(200).json("Follow Successful");
        } else {
          return res.status(403).json("Already Following");
        }
      } else {
        return res.status(403).json("Wrong Ids");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can't follow yourself !");
  }
});

//Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.body.userId);
      const currentUser = await User.findById(req.params.id);
      if (userToFollow && currentUser) {
        if (currentUser.following.includes(req.body.userId)) {
          await currentUser.updateOne({
            $pull: { following: req.body.userId },
          });
          await userToFollow.updateOne({ $pull: { followers: req.params.id } });
          res.status(200).json("Unfollow Successful");
        } else {
          return res.status(403).json("You Are Not Following");
        }
      } else {
        return res.status(403).json("Wrong Ids");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can't follow yourself !");
  }
});
module.exports = router;

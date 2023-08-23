const router = require("express").Router();
const Conversation = require("../models/Conversation");

//New Conversation
router.post("/", async (req, res) => {
  const newConv = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    await newConv.save();
    res.status(200).json("Conversation Created");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Conversation from a user
router.get("/:userId", async (req, res) => {
  try {
    const conv = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conv);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Conversation includes 2 users Ids
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conv = await Conversation.findOne({
      members: { $all: [req.params.firstUserId , req.params.secondUserId] },
    });
    res.status(200).json(conv);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

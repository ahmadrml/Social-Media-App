const router = require("express").Router();
const Message = require("../models/Message");

//create a message
router.post("/", async (req, res) => {
  const newMsg = new Message(req.body);
  try {
    await newMsg.save();
    res.status(200).json("Message Created");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a message
router.get("/:convId", async (req, res) => {
  const newMsg = new Message(req.body);
  try {
    const messages = await Message.find({
      convId: req.params.convId
    })
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

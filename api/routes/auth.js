const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password , salt)

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json("User Added");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("User Not Found");

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) res.status(200).json(user);
      else{
        res.status(404).json("error");
        console.log(err);
      }
    });

  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    req.session.destroy
    res.redirect("/login")
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

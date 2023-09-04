const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const convRoute = require("./routes/conversations");
const msgRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");

dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/socialDB");

const app = express();
const port = 8800;

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", convRoute);
app.use("/api/messages", msgRoute);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File Uploaded Successfully");
  } catch (error) {
    console.log(error);
  }
});

//upload profile
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/person");
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, req.body.name);
  },
});

const uploadProfile = multer({ storage: storageProfile });

app.post("/api/upload-profile", uploadProfile.single("file"), (req, res) => {
  try {
    return res.status(200).json("File Uploaded Successfully");
  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () => {
  console.log("Listening on port " + port);
});

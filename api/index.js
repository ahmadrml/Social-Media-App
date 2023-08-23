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

dotenv.config();

const app = express();
const port = 8800;

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", convRoute);
app.use("/api/messages", msgRoute);

mongoose.connect("mongodb://127.0.0.1:27017/socialDB");

app.listen(port, () => {
  console.log("Listening on port " + port);
});

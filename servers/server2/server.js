const express = require("express");
const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/my_db";
const app = express();
require("dotenv").config({path: "./config.env"});

app.use(express.json({extended: false}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use("/tasks", require("./routes/tasks"));
app.use("/users", require("./routes/users"));
//connect to mongoDB
mongoose
  .connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("mongoDB is connected by using mongoose lib");
  });

// app listen on port
const port = 5000;
app.listen(5000, () => {
  console.log(`Server is running on port ${port}`);
});

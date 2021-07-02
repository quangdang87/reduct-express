const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongodbUrl = "mongodb://127.0.0.1:27017/my_db";
const app = express();

app.use(express.json({extended: false}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

//Connect to MongoDB
MongoClient.connect(mongodbUrl, {useUnifiedTopology: true}, (err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database by using MongoClient");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
    try {
      const db = client.db("my_db");
      const tasks = db.collection("tasks");
      //query all data
      app.get("/tasks", (reqest, response) => {
        tasks.find({}).toArray((err, res) => {
          if (err) {
            response
              .status(500)
              .json({msg: "Error 500. Internal Server Error."});
          } else {
            response.status(200).json({msg: "OK", data: res});
          }
        });
      });
      //insert data
      app.post("/tasks", (request, response) => {
        const {name} = request.body;
        tasks.insertOne({name}, (err, res) => {
          if (err) {
            response
              .status(500)
              .json({msg: "Error 500. Internal Server Error."});
          } else {
            response
              .status(201)
              .json({msg: "OK", data: {_id: res.insertedId, name}});
          }
        });
      });
      //edit
      app.put("/tasks", (request, response) => {
        const {_id, name} = request.body;
        tasks
          .findOneAndUpdate({_id: ObjectId(_id)}, {$set: {name}})
          .then((res) => {
            response
              .status(200)
              .json({msg: "OK", data: {_id: res.value._id, name}});
          })
          .catch((err) => {
            throw err;
          });
      });
      //delete
      app.delete("/tasks", (request, response) => {
        const _id = request.query._id;
        tasks
          .deleteOne({_id: ObjectId(_id)})
          .then((res) => {
            response.status(200).json({msg: "OK", _id});
          })
          .catch((err) => {
            throw err;
          });
      });
    } catch (error) {
      console.log("error: ", error);
      response.status(500).json({msg: "Error 500. Internal Server Error."});
    }
  }
});

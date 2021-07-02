const e = require("express");
const express = require("express");
const app = express();
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: "AIzaSyBh_ZPfSemozKN_9QOpHVPNIZQGlMShTPs",
  authDomain: "expresswithfirebase-64b16.firebaseapp.com",
  projectId: "expresswithfirebase-64b16",
  storageBucket: "expresswithfirebase-64b16.appspot.com",
  messagingSenderId: "504906878804",
  appId: "1:504906878804:web:d862ef24ae01f59c4b42c1",
});

const db = firebase.firestore();
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

app.get("/tasks", async (req, res) => {
  try {
    let arr = [];
    const data = await db.collection("tasks").get();
    data.forEach((doc) => {
      let task = {
        _id: doc.id,
        ...doc.data(),
      };
      arr.push(task);
    });
    res.status(200).json({msg: "OK", data: arr});
  } catch (error) {
    console.log(error);
  }
});

app.post("/tasks", async (req, res) => {
  const {name} = req.body;
  if (name) {
    try {
      const docRef = await db.collection("tasks").add({name});
      res.status(201).json({msg: "OK", data: {_id: docRef.id, name}});
    } catch (error) {
      console.log(error);
    }
    res.status;
  } else {
    res.status(400).json({msg: "Invalid data"});
  }
});
app.post("/editTask", async (req, res) => {
  const {_id, name} = req.body;
  if (_id && name) {
    try {
      await db.collection("tasks").doc(_id).update({name});
      console.log("id:", _id);
      res.status(200).json({msg: "OK", data: {_id, name}});
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({msg: "Invalid data"});
  }
});
app.get("/delete", async (req, res, next) => {
  const _id = req.query._id;
  if (_id) {
    try {
      const docRef = await db.collection("tasks").doc(_id).delete();
      res.status(200).json({msg: "OK", data: {_id}});
    } catch (error) {
      next(error);
      console.log(error);
    }
  } else {
    res.status(400).json({msg: "Invalid data."});
  }
});

//error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({msg: "Error 500. Internal Server Error."});
  } else {
    next();
  }
});
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});

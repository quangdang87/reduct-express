const router = require("express").Router();
const Task = require("../models/task");
const NewUser = require("../models/newUser");
const auth = require("../Utils/utils");
router.get("/", auth, async (request, response) => {
  try {
    const result = await Task.find({user_id: request.user});
    response.status(200).json({msg: "OK", data: result});
  } catch (error) {
    response.status(500).json({msg: "Error 500. Internal Server Error"});
    console.log(error);
  }
});

router.post("/", auth, async (request, response) => {
  try {
    const {name} = request.body;

    if (name) {
      const task = new Task({name, user_id: request.user});
      const result = await task.save();
      console.log("Result after added: ", result);
      response.status(201).json({msg: "OK", data: result});
    } else {
      response.status(400).json({msg: "Invalid data"});
    }
  } catch (err) {
    response.status(500).json({msg: "Error 500. Internal Server Error."});
  }
});
router.put("/", auth, (request, response) => {
  try {
    const {_id, name} = request.body;
    if (_id && name) {
      Task.findByIdAndUpdate(
        _id,
        {name},
        {useFindAndModify: false},
        (err, data) => {
          response.status(200).json({msg: "OK", data: {_id: data._id}});
        }
      );
    } else {
      response.status(400).json({msg: "Invalid data"});
    }
  } catch (err) {
    response.status(500).json({msg: "Error 500. Internal Server Error."});
  }
});
router.delete("/", async (request, response) => {
  try {
    const _id = request.query._id;
    if (_id) {
      const res = await Task.deleteOne({_id});
      response.status(200).json({msg: "OK", data: res});
    } else {
      response.status(400).json({msg: "Invalid ID"});
    }
  } catch (err) {
    response.status(500).json({msg: "Error happended"});
  }
});

module.exports = router;

const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

module.exports = Task = mongoose.model("tasks", taskSchema);

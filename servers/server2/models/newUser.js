const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const NewUsers = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = NewUser = mongoose.model("users", NewUsers);

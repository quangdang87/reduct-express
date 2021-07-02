const router = require("express").Router();
const NewUser = require("../models/newUser");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
//Public route
router.post("/register", async (req, res) => {
  try {
    const {name, email, password} = req.body;
    const user = await NewUser.findOne({email});
    if (name && email && password) {
      if (user) {
        return res.status(400).json({msg: "User already exists."});
      }

      const newUser = new NewUser({
        name,
        email,
        password,
      });

      await newUser.save();
      console.log("New User: ", newUser);
      const payload = {
        id: newUser._id,
      };
      jwt.sign(payload, secret, (err, token) => {
        if (err) throw err;
        res.status(201).json({msg: "OK", data: token});
      });
    } else {
      res.status(400).json({msg: "Invalid data"});
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({msg: "Invalid data"});
    }
    const user = await NewUser.findOne({email}).exec();
    if (!user) {
      return res.status(404).json({msg: "User doesn't exists"});
    }
    // compare password
    if (user.password === password) {
      const payload = {id: user.id};
      jwt.sign(payload, secret, (err, token) => {
        if (err) throw err;
        return res.status(200).json({token});
      });
    } else {
      return res.status(401).json({msg: "Invalid password"});
    }
  } catch (err) {
    console.log("Error happened when login");
  }
});
//Private route
//need the middleware to handle verification
router.get("/", async (req, res) => {
  try {
    const result = await NewUser.find();
    res.status(200).json({msg: "OK", data: result});
  } catch (error) {
    res.status(500).json({msg: "Error 500. Internal Server Error"});
  }
});

module.exports = router;

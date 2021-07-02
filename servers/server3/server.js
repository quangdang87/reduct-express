const express = require("express");
const app = express();
const mysql = require("mysql");
/*
In order to use mysql lib with express. We have to make sure that the above database and tables have to be created before running the server.
In this example, an new user quangdang has been created in mysql server and have been granted all needed privileges.
*/
const con = mysql.createConnection({
  host: "localhost",
  user: "quangdang",
  password: "310587",
  database: "tasks",
});
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

con.connect((err) => {
  if (err) {
    console.log("error happend when connecting to mysql.", err);
    return;
  } else {
    console.log("Connected to MySql by using mysql lib.");
  }
});

app.get("/tasks", (request, response) => {
  con.query("SELECT * FROM tasksLists;", (err, rows) => {
    if (err) {
      console.log(err);
      con.query("show tables", (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          console.log(rows);
        }
      });

      response.status(500).json({msg: "Error 500. Internal Server Error."});
    } else {
      response.status(200).json({msg: "OK", data: rows});
    }
  });
});
app.post("/tasks", (request, response) => {
  const {name} = request.body;
  if (name) {
    con.query("INSERT INTO tasksLists SET ?", {name}, (err, rows) => {
      if (err) {
        response.status(500).json({msg: "Error 500. Internal Server Error."});
      } else {
        response
          .status(201)
          .json({msg: "OK", data: {_id: rows.insertId, name}});
      }
    });
  } else {
    response.status(400).json({msg: "Invalid task name"});
  }
});
app.post("/editTask", (request, response) => {
  const {_id, name} = request.body;
  if (_id && name) {
    con.query(
      "UPDATE tasksLists SET name=? WHERE _id= ?",
      [name, _id],
      (err, rows) => {
        if (err) {
          response.status(500).json({msg: "Error 500. Internal Server Error."});
        } else {
          response.status(200).json({msg: "OK", data: {_id, name}});
        }
      }
    );
  } else {
    response.status(500).json({msg: "Invalid data"});
  }
});
app.get("/delete", (request, response) => {
  const _id = request.query._id;
  if (_id) {
    con.query("DELETE FROM tasksLists WHERE _id=?", [_id], (err, rows) => {
      if (err) {
        response.status(500).json({msg: "Error 500. Internal Server Error"});
      } else {
        response.status(200).json({msg: "OK", data: {_id}});
      }
    });
  } else {
    response.status(400).json({msg: "Invalid id."});
  }
});
app.get("/get", (req, res) => {
  console.log(req.cookies);
  res.send("OK");
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

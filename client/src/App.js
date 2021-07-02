import "./App.css";
import {useState, useEffect, Fragment} from "react";
import axios from "axios";
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };
  const handleEdit = (e) => {
    setEditName(e.target.value);
  };

  const saveEdit = async (id) => {
    try {
      const _id = tasks[id]._id;
      const res = await axios.put("http://localhost:5000/tasks", {
        _id,
        name: editName,
      });
      console.log("res.data._id: ", res.data.data._id);
      let temp_arr = [...tasks];
      temp_arr[id]._id = res.data.data._id;
      temp_arr[id].name = editName;
      temp_arr[id].edit = false;
      setTasks(temp_arr);
      setEditName("");
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    if (name !== "") {
      try {
        const res = await axios.post("http://localhost:5000/tasks", {name});
        let temp = [...tasks];
        temp.push({id: res.data._id, name, edit: false});
        setTasks(temp);
        setName("");
      } catch (error) {}
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete("http://localhost:5000/tasks", {
        params: {_id: id},
      });
      const _id = res._id;
      let temp = tasks.filter((task) => task.id !== _id);
      setTasks(temp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //load data from database
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");
        setTasks(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [tasks.length]);
  return (
    <>
      <h1 className="card-title text-center mt-5">React and Express Demo</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-10 mb-3">
            <input
              type="text"
              name="addTask"
              placeholder="Add a task"
              value={name}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="col-2 text-center">
            <a className="btn btn-primary" onClick={addTask}>
              <span>
                Add <i className="fa fa-plus"></i>
              </span>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tasks list</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {tasks.map((task, index) => (
                  <Fragment key={index}>
                    <div className="col-8">
                      {task.edit ? (
                        <Fragment>
                          <div className="mb-3">
                            <input
                              type="text"
                              className="form-control"
                              value={editName}
                              onChange={handleEdit}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                saveEdit(index);
                              }}
                            >
                              Save Change
                            </button>
                          </div>
                        </Fragment>
                      ) : (
                        <p>{tasks[index].name}</p>
                      )}
                    </div>
                    <div className="col-4 d-flex">
                      <div className="text-center w-50 mx-0">
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            if (!task.edit) {
                              let temp_arr = [...tasks];
                              temp_arr[index].edit = true;
                              setTasks(temp_arr);
                              setEditName(task.name);
                            }
                          }}
                        >
                          Edit <i className="fa fa-pencil"></i>
                        </button>
                      </div>
                      <div className="text-center w-50">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

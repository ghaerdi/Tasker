const Task = require("../models/task");

async function getAllTasks(req, res) {
  const tasks = await Task.find();

  if (!tasks[0])
    return res
      .status(400)
      .json({error: true, msg: "no one task found", tasks: tasks })

  res.json({error: false, msg: "task found", tasks: tasks })
}

async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task)
    return res
      .status(400)
      .json({ error: true, msg: "task not found", task: task })

  res.json({ error: false, msg: "task found", task: task })
}

async function createTask(req, res) {
  const { title, description } = req.body;

  if (!(title && description))
    return res
      .status(400)
      .json({ error: true, msg: "title and description are required" })

  const newTask = new Task({
    ...req.body,
  });

  try {
    await newTask.save();
    res.json({ error: false, msg: "task saved", Task: newTask })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: true, msg: "unknow error by saving a new task" })
  }
}

async function editTask(req, res) {
  try {
    const { title, description } = req.body
    const task = await Task.findOne({ _id: req.params.id })

    if (!task)
      return res.status(400).json({ error: true, msg: "task not found" });

    if (task.title === title && task.description === description)
      return res.status(300).json({ error: true, msg: "need new info to update" })

    await Task.findOneAndUpdate({ _id: req.params.id }, {
      ...req.body,
    });

    res.json({ error: false, msg: "task updated" })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: true, msg: "unknow error by editing a task" })
  }
}

async function removeTask(req, res) {
  try {
    const removeTask = await Task.findByIdAndDelete(req.params.id);

    if (!removeTask)
      return res.status(400).json({ error: true, msg: "task not found" });

    res.json({ error: false, msg: "task removed" })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({error: true, msg: "unknow error by removing a task" })
  }
}

module.exports = { getAllTasks, getTask, createTask, editTask, removeTask };

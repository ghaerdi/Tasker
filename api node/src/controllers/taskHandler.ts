import Task from "../models/task";
import { Request, Response } from "express";

export async function getAllTasks(_req: Request, res: Response) {
  const tasks = await Task.find();

  if (!tasks[0]) {
    res.status(400);
    res.json({ error: true, msg: "no one task found", tasks: tasks });
    return;
  }

  res.json({ error: false, msg: "task found", tasks: tasks });
}

export async function getTask(req: Request, res: Response) {
  const task = await Task.findOne({ _id: req.params.id });

  if (!task) {
    res.status(400);
    res.json({ error: true, msg: "task not found", task: task });
    return;
  }

  res.json({ error: false, msg: "task found", task: task });
}

export async function createTask(req: Request, res: Response) {
  const { title, description } = req.body;

  if (!(title && description)) {
    res.status(400);
    res.json({ error: true, msg: "title and description are required" });
    return;
  }

  const newTask = new Task({
    ...req.body,
  });

  try {
    await newTask.save();
    res.json({ error: false, msg: "task saved", Task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: true, msg: "unknow error by saving a new task" });
  }
}

export async function editTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    const task = await Task.findOne({ _id: req.params.id });

    if (!task) {
      res.status(400);
      res.json({ error: true, msg: "task not found" });
      return;
    }

    if (task.title === title && task.description === description) {
      res.status(300);
      res.json({ error: true, msg: "need new info to update" });
      return;
    }

    await Task.findOneAndUpdate({ _id: req.params.id }, {
      ...req.body,
    });

    res.json({ error: false, msg: "task updated" });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: true, msg: "unknow error by editing a task" });
  }
}

export async function removeTask(req: Request, res: Response) {
  try {
    const removeTask = await Task.findByIdAndDelete(req.params.id);

    if (!removeTask) {
      res.status(400);
      res.json({ error: true, msg: "task not found" });
      return;
    }

    res.json({ error: false, msg: "task removed" });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: true, msg: "unknow error by removing a task" });
  }
}

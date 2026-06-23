require("dotenv").config();

const Todo = require("./Todo");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/add", async (req, res) => {
  const { task } = req.body;

  const todo = await Todo.create({
    task
  });

  res.json({
    message: "Todo added",
    todo
  });
});

app.patch("/update", async (req, res) => {
  const { id, task } = req.body;

  const todo = await Todo.findByIdAndUpdate(
    id,
    { task },
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  res.json({
    message: "Todo updated",
    todo
  });
});

app.delete("/delete", async (req, res) => {
  const { id } = req.body;

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  res.json({
    message: "Todo deleted"
  });
});

app.patch("/complete", async (req, res) => {
  const { id } = req.body;

  const todo = await Todo.findByIdAndUpdate(
    id,
    { completed: true },
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found"
    });
  }

  res.json({
    message: "Todo completed",
    todo
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const express = require("express");
const router = express.Router();

const {getConnectedClient} = require("./database.js");

const {ObjectId} = require("mongodb");

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("TodoApp").collection("todos");
  return collection;
};

// GET Routes /todos
router.get("/todos", async (req, res) => {
  const collection = getCollection();
  const todos = await collection.find({}).toArray();

  return res.status(200).json(todos);
});

// POST Routes /todos
router.post("/todos", async (req, res) => {
  const collection = getCollection();
  let {todo} = req.body;

  if (!todo) {
    return res.status(400).json({message: "Error! No Todo!"});
  }

  todo = typeof todo === "string" ? todo : JSON.stringify(todo);

  const newTodo = await collection.insertOne({todo, status: false});

  return res.status(201).json({todo, status: false, _id: newTodo.insertedId});
});

// DELETE ROUTES /todos:id
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deletedTodo = await collection.deleteOne({_id});

  return res.status(200).json({deletedTodo});
});

// PUT ROUTES /todos:id

router.put("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const updateThisTodo = await collection.findOne({_id});

  if (!updateThisTodo) {
    return res.status(404).json({message: "Todo not found"});
  }

  if (typeof req.body.status !== "boolean") {
    res.status(400).json({message: "ERROR! Status needs to be Boolean"});
  }

  const updatedFields = {
    ...updateThisTodo,
    ...req.body,
  };

  const updatedTodo = await collection.updateOne(
    {_id},
    {$set: {...updatedFields}}
  );

  res.status(200).json({updatedTodo});
});

module.exports = router;

import userService from "../services/user.service.js";

async function insertOne(req, res) {
  const user = req.body;
  await userService.insertOne({ user });
  res.sendStatus(201);
}

async function find(req, res) {}
async function updateOne(req, res) {}
async function deleteOne(req, res) {}

const userController = { insertOne, find, updateOne, deleteOne };
export default userController;
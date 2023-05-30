import userRepository from "../repositories/user.repository.js";

async function insertOne({ user }) {
  await userRepository.insertOne({ user });
}

async function find() {}
async function updateOne() {}
async function deleteOne() {}

const userService = { insertOne, find, updateOne, deleteOne };
export default userService;

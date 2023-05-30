import db from "../configs/database.connection.js";

async function insertOne({ user }) {
    await db.query(`INSERT into users ...`)
}

async function find() {}
async function updateOne() {}
async function deleteOne() {}

const userRepository = { insertOne, find, updateOne, deleteOne };
export default userRepository;

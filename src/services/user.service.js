import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import errors from "../errors/index.errors.js";
import userRepository from "../repositories/user.repository.js";
import withTransaction from "../utils/withTransaction.util.js";
import postRepository from "../repositories/post.repository.js";

async function signUp({ email, password, username, picture }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await userRepository.createUser({ email, password: hashedPassword, username, picture });
}

async function signIn({ email, password }) {
  const { rowCount: emailExists, rows } = await userRepository.findUserByEmail({ email });
  if (!emailExists) throw errors.unauthorized();

  const foundUser = rows[0];
  const isValidPassword = await bcrypt.compare(password, foundUser.password);
  if (!isValidPassword) throw errors.unauthorized();

  const token = uuid();
  const { rowCount: sessionCreated } = await userRepository.createSession({ userId: foundUser.id, token });
  if (sessionCreated) {
    return { token };
  } else {
    throw errors.unauthorized();
  }
}

async function signOut({ userId, token }) {
  await userRepository.signOutUser({ userId, token });
}

async function getUser(userId) {
  return await userRepository.findUserById(userId);
}

async function searchUsers(searchText) {
  return await userRepository.searchUsers(searchText);
}

async function getUserDataWithPosts(id, page) {
  const getUserDataWithPostsTransaction = async (client) => {
    const userData = await userRepository.findUserById(id, client);
    const posts = await postRepository.getPostsById(id, page, client);
    return { userData: userData.rows[0], posts: posts.rows };
  };
  return await withTransaction(getUserDataWithPostsTransaction);
}

const userService = { signUp, signIn, signOut, getUser, searchUsers, getUserDataWithPosts };
export default userService;

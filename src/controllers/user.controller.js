import userService from "../services/user.service.js";

async function signUp(req, res) {
  await userService.signUp({ ...req.body });
  res.sendStatus(201);
}

async function signIn(req, res) {
  const token = await userService.signIn({ ...req.body });
  res.send(token);
}

async function signOut(_req, res) {
  await userService.signOut({ ...res.locals });
  res.sendStatus(200);
}

async function getUser(req, res) {
  const user = await userService.getUser(res.locals.userId);
  res.send(user.rows[0]);
}

async function getUserById(req, res) {
  const { id } = req.params;
  const user = await userService.getUser(id);
  res.send(user.rows[0]);
}

async function searchUsers(req, res) {
  const result = await userService.searchUsers(req.query.searchText);
  res.send(result.rows);
}

async function follow(req, res) {
  const { followedId } = req.params;
  const { userId } = res.locals;
  const response = await userService.follow({followedId, userId });
  res.send(response);
}

async function getUserDataWithPosts(req, res) {
  const { id } = req.params;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const result = await userService.getUserDataWithPosts(id, page);
  res.send(result);
}

const userController = { signUp, signIn, signOut, getUser, searchUsers, getUserById, getUserDataWithPosts, follow };

export default userController;

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

async function searchUsers(req, res){
  const result = await userService.searchUsers(req.query.searchText);
  res.send(result.rows);
}

const userController = { signUp, signIn, signOut, getUser, searchUsers };
export default userController;

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

const userController = { signUp, signIn, signOut };
export default userController;

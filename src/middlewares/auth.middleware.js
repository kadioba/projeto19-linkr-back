import errors from "../errors/index.errors.js";
import uuidValidator from "../utils/uuidValidator.util.js";
import userRepository from "../repositories/user.repository.js";

async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token || !uuidValidator(token)) throw errors.unauthorized();

  const queryResult = await userRepository.findUserByToken({ token });

  if (!queryResult.rowCount || !queryResult.rows[0].active) throw errors.unauthorized();

  const { user_id: userId } = queryResult.rows[0];
  res.locals.userId = userId;
  res.locals.token = token;

  next();
}

export default authValidation;

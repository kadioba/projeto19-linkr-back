import httpStatus from "http-status";

const errorStatusCodes = {
  UnauthorizedError: httpStatus.UNAUTHORIZED,
  NotFoundError: httpStatus.NOT_FOUND,
  ConflictError: httpStatus.CONFLICT,
  UnprocessableEntityError: httpStatus.UNPROCESSABLE_ENTITY,
};

const postgresErrorCodes = {
  23505: httpStatus.CONFLICT,
};

function errorMiddleware(err, _req, res, _next) {
  const response = err.message || "Internal Server Error";
  let statusCode =
    errorStatusCodes[err.name] ||
    postgresErrorCodes[err.code] ||
    httpStatus.INTERNAL_SERVER_ERROR;

  if (postgresErrorCodes.hasOwnProperty(err.code)) {
    return res.sendStatus(statusCode);
  } else {
    return res.status(statusCode).send(response);
  }
}

export default errorMiddleware;
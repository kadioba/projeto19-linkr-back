function errorFactory(name, message) {
    return { name, message };
  }
  
  function unauthorized(message = "Unauthorized") {
    return errorFactory("UnauthorizedError", message);
  }
  
  function notFound(message = "Not Found") {
    return errorFactory("NotFoundError", message);
  }
  
  function conflict(message = "Conflict") {
    return errorFactory("ConflictError", message);
  }
  
  function unprocessableEntity(message = "Unprocessable Entity") {
    return errorFactory("UnprocessableEntityError", message);
  }
  
  const errors = { unauthorized, notFound, conflict, unprocessableEntity };
  export default errors;
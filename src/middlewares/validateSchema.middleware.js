import errors from "../errors/index.errors.js";

function validateSchema(schema, field = "body") {
  return (req, _res, next) => {
    const validation = schema.validate(req[field], { abortEarly: false });

    if (validation.error) {
      const errorsList = validation.error.details.map((detail) => detail.message);
      throw errors.unprocessableEntity(errorsList);
    }

    next();
  };
}

export default validateSchema;
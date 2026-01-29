export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      allowUnknown: true, // Allow fields not in the schema (like metadata)
      stripUnknown: true  // Remove fields not in the schema from req.body
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, ''))
        .join(', ');
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
};

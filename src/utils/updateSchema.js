import user from "../models/user.js";

export const updateValidationSchema = {
  username: {
    optional: true,
    isString: true,
    trim: true,
    errorMessage: "Nickname must be a string",
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: "Email must be valid",
    },
    trim: true,
    normalizeEmail: true,
  },
  name: {
    optional: true,
    isString: true,
    trim: true,
    errorMessage: "Name must be a string",
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
  },
  role: {
    isIn: {
      options: [
        ["Eletronica", "Pesquisa", "Estruturas", "Marketing", "Admin", "TI"],
      ],
      errorMessage: "role incorreta ou vazia",
    },
  },
  custom: {
    options: (value, { req }) => {
      user.validateUpdate(req.body);
      return true;
    },
  },
};

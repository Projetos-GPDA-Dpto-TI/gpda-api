import user from "../models/user.js";

export const signupValidationSchema = {
  username: {
    trim: true,
    isAlphanumeric: true,
    notEmpty: { errorMessage: "username não pode ser vazio" },
    custom: {
      options: async (username) => {
        await user.validateUniqueUsername(username);
      },
      errorMessage: "username já foi utilizado",
    },
  },
  name: {
    notEmpty: {
      errorMessage: "nome não pode ser vazio",
    },
  },
  email: {
    isEmail: {
      errorMessage: "email inválido",
    },
    custom: {
      options: async (email) => {
        await user.validateUniqueEmail(email);
      },
      errorMessage: "email já foi utilizado",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "senha não pode ser vazia",
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
};

export const signValidationSchema: import('express-validator').Schema = {
  username: {
    trim: true,
    isAlphanumeric: true,
    notEmpty: { errorMessage: '`username` não pode ser vazio' },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: 'o username precisa estar entre 5 e 32 caracteres',
    },
  },
  name: {
    trim: true,
    notEmpty: {
      errorMessage: '`nome` não pode ser vazio',
    },
    isAlpha: true,
  },
  email: {
    isEmail: {
      errorMessage: '`email` precisa ser um e-mail válido',
    },
  },
  password: {
    notEmpty: {
      errorMessage: '`senha` não pode ser vazia',
    },
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: 'a senha precisa ter pelo menos 8 caracteres',
    },
  },
  role: {
    notEmpty: {
      errorMessage: '`role` não pode ser vazia',
    },
  },
};

export const loginValidationSchema: import('express-validator').Schema = {
  username: {
    optional: true,
    notEmpty: true,
  },
  email: {
    optional: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};

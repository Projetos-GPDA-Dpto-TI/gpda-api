export const loginValidationSchema: import('express-validator').Schema = {
  email: {
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};

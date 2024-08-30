export const loginValidationSchema = {
  email: {
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};

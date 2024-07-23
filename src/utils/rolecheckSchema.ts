export const roleValidationSchema: import('express-validator').Schema = {
  role: {
    isIn: {
      options: [
        ['Eletronica', 'Pesquisa', 'Estruturas', 'Marketing', 'Admin', 'TI'],
      ],
      errorMessage: 'Invalid or missing Role',
    },
  },
};

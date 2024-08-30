export const roleValidationSchema = {
  role: {
    isIn: {
      options: [
        ["Eletronica", "Pesquisa", "Estruturas", "Marketing", "Admin", "TI"],
      ],
      errorMessage: "Invalid or missing Role",
    },
  },
};

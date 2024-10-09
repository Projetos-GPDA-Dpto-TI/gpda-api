import "dotenv/config";
import "dotenv-expand/config";

import user from "../../src/models/user.js";

async function createAdminUser() {
  await user.signUser({
    name: "John Doe",
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    role: "Admin",
    password: process.env.ADMIN_PASSWORD,
  });
}

createAdminUser();

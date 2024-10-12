import "dotenv/config";
import "dotenv-expand/config";

import user from "../../src/models/user.js";
import database from "../database.js";

async function setupAdmin() {
  if (!(await checkAdminExistance())) {
    createAdminUser();
    console.log("Admin user created");
  } else {
    console.log("Admin user already created");
  }
}

async function checkAdminExistance() {
  const response = await database.query(
    "SELECT * from member WHERE role='Admin';",
  );
  const parsedResponse = response.rowCount;
  if (parsedResponse === 0) {
    return false;
  }
  return true;
}

async function createAdminUser() {
  await user.signUser({
    name: "John Doe",
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    role: "Admin",
    password: process.env.ADMIN_PASSWORD,
  });
}

setupAdmin();

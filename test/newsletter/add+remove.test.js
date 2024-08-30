import database from "../../infra/database.js";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; CREATE schema public;");
  await fetch("http://localhost:3000/api/migrations", {
    method: "POST",
  });
});

async function retrieveEmail() {
  try {
    const response = await database.query("SELECT * from newsletter;");
    return response.rows[0].email;
  } catch (_err) {
    return undefined;
  }
}

const emailData = {
  email: "usuario@example.com",
};

test("Add email to newsletter table", async () => {
  expect(await retrieveEmail()).toBeUndefined();
  const response = await fetch(
    "http://localhost:3000/api/newsletter/subscribe",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    },
  );

  expect(response.status).toBe(200);
  expect(await retrieveEmail()).toBe(emailData.email);
});

test("Remove email on newsletter table", async () => {
  expect(await retrieveEmail()).toBe(emailData.email);
  const response = await fetch(
    "http://localhost:3000/api/newsletter/unsubscribe",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    },
  );

  expect(response.status).toBe(200);
  expect(await retrieveEmail()).toBeUndefined();
});

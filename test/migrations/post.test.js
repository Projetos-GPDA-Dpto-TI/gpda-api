import database from "../../infra/database.js";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; CREATE schema public;");
});

async function databaseMigrationsRows() {
  try {
    const response = await database.query("SELECT * FROM pgmigrations");
    return response.rowCount;
  } catch (_err) {
    return undefined;
  }
}

test("POST to /api/v1/migrations should return 201", async () => {
  expect(await databaseMigrationsRows()).toBeUndefined();

  const response = await fetch("http://localhost:3000/api/migrations", {
    method: "POST",
  });

  const responseBody = await response.json();

  expect(response.status).toBe(201);

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBe(await databaseMigrationsRows());
});

import database from "../../infra/database.js";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; CREATE schema public;");
  await fetch("http://localhost:3000/api/migrations?test_name=test-auth", {
    method: "POST",
  });
});

//prettier-ignore
test("Try to penetrate all services that need auth", async () => {
  const response1 = await fetch("http://localhost:3000/api/user/list?test_name=test-auth");
  expect(response1.status).toBe(401);

  const response2 = await fetch("http://localhost:3000/api/user/logout?test_name=test-auth")
  expect(response2.status).toBe(401)

  const response3 = await fetch("http://localhost:3000/api/user/role/TI?test_name=test-auth")
  expect(response3.status).toBe(401)

  const response4 = await fetch("http://localhost:3000/api/user/delete/2?test_name=test-auth", {method: "DELETE"})
  expect(response4.status).toBe(401)

  const response5 = await fetch("http://localhost:3000/api/user/update?test_name=test-auth", {method: "PUT"})
  expect(response5.status).toBe(401)

  const response6 = await fetch("http://localhost:3000/api/news/publicate?test_name=test-auth", {method: "POST"})
  expect(response6.status).toBe(401)
  
  const response7 = await fetch("http://localhost:3000/api/news/draft?test_name=test-auth", {method: "POST"})
  expect(response7.status).toBe(401)

  const response8 = await fetch("http://localhost:3000/api/news/undraft/1?test_name=test-auth", {method: "PATCH"})
  expect(response8.status).toBe(401)

  const response9 = await fetch("http://localhost:3000/api/news/archive/1?test_name=test-auth", {method: "PATCH"})
  expect(response9.status).toBe(401)

  const response10 = await fetch("http://localhost:3000/api/news/delete/1?test_name=test-auth", {method: "DELETE"})
  expect(response10.status).toBe(401)

  const response11 = await fetch("http://localhost:3000/api/migrations?test_name=test-auth", {method: "GET"})
  expect(response11.status).toBe(401)

  const response12 = await fetch("http://localhost:3000/api/migrations?test_name=test-auth", {method: "POST"})
  expect(response12.status).toBe(401)
});

import database from "../../infra/database.js";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; CREATE schema public;");
  await fetch("http://localhost:3000/api/migrations", {
    method: "POST",
  });
});

const userData = {
  username: "jdoe",
  email: "jdoe@example.com",
  password: "12345678",
  name: "John Doe",
  role: "TI",
};

test("Add and delete a single user", async () => {
  const list1Response = await fetch("http://localhost:3000/api/user/list");
  const list1responseBody = await list1Response.json();
  expect(list1responseBody).toStrictEqual([]);

  const signResponse = await fetch("http://localhost:3000/api/user/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const signresponseBody = await signResponse.json();
  const userobtainedData = signresponseBody.user_signed;
  expect(signresponseBody.message).toBe("User created");

  expect(signResponse.status).toBe(201);

  const list2Response = await fetch("http://localhost:3000/api/user/list");
  const list2ResponseBody = await list2Response.json();
  expect(list2ResponseBody).toStrictEqual([userobtainedData]);

  const deleteResponse = await fetch(
    `http://localhost:3000/api/user/delete/${userobtainedData.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const deleteresponseBody = await deleteResponse.json();
  expect(deleteresponseBody.deleted_user).toStrictEqual(userobtainedData);

  const list3Response = await fetch("http://localhost:3000/api/user/list");
  const list3responseBody = await list3Response.json();

  expect(list3responseBody).toStrictEqual([]);
});

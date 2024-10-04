import database from "../../infra/database.js";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; CREATE schema public;");
  await fetch("http://localhost:3000/api/migrations", {
    method: "POST",
  });
});

const newSampleMock = {
  title: "Novas Descobertas na Pesquisa Espacial",
  description: "Estudo revela novas informações sobre exoplanetas.",
  content:
    "Um novo estudo da NASA revelou informações intrigantes sobre exoplanetas que podem suportar vida. As descobertas foram feitas utilizando telescópios de última geração e técnicas de observação avançadas, proporcionando uma nova perspectiva sobre a astrobiologia.",
  author_id: "123456",
  image_url: "https://example.com/imagem.jpg",
};

test("Add and delete a single new", async () => {
  const list1Response = await fetch("http://localhost:3000/api/news/view");
  const list1responseBody = await list1Response.json();
  expect(list1responseBody).toStrictEqual([]);

  const newResponse = await fetch("http://localhost:3000/api/news/publicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSampleMock),
  });
  const parsedNewResponse = await newResponse.json();
  const newObtainedData = parsedNewResponse.publicated_new;

  const list2Response = await fetch("http://localhost:3000/api/news/view");
  const list2ResponseBody = await list2Response.json();
  expect(list2ResponseBody).toStrictEqual([newObtainedData]);

  const deleteResponse = await fetch(
    `http://localhost:3000/api/news/delete/${newObtainedData.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const deleteResponseBody = await deleteResponse.json();
  expect(deleteResponseBody.deleted_new).toStrictEqual(newObtainedData);

  const list3Response = await fetch("http://localhost:3000/api/news/view");
  const list3ResponseBody = await list3Response.json();
  expect(list3ResponseBody).toStrictEqual([]);
});

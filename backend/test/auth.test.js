const request = require("supertest");
const app = require("../server");

test("Register user", async () => {
  const email = `user${Date.now()}@test.com`;

  const res = await request(app)
    .post("/auth/register")
    .set("Content-Type", "application/json")
    .send({ email, password: "123" });

  expect(res.statusCode).toBe(200);
});

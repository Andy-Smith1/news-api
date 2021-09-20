const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET Invalid path", () => {
  test("404: Tells user that the path is invalid", () => {
    return request(app)
      .get("/api/turtles")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Invalid URL" });
      });
  });
});

describe("GET /api/topics", () => {
  test("200: returns array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        topics.forEach((topic) => {
          expect(topic).toEqual({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

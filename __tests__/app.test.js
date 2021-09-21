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

describe("GET /api/articles/:article_id", () => {
  test("200: returns requested article", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 9,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          comment_count: 2,
        });
      });
  });
  test("404: returns not found message if searched for a valid, non existing id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates votes on article and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(1);
      });
  });
  test("400: Tells user if inc_votes is not included or if sending multiple properties", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ body: "hello", inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Only send votes update. e.g {inc_votes: 1}"
        );
      });
  });
  test("400: Informs user if only provide an inc_votes property in body but invalid type ", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid type input");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Returns array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

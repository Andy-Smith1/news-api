const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const { get } = require("superagent");

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
            comment_count: expect.any(String),
          });
        });
        expect(response.body.articles).toHaveLength(12);
      });
  });
  test("200: sorts by date by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at");
      });
  });
  test("200: accepts sort_by queries for valid columns, ordered ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("title", {
          descending: false,
        });
      });
  });
  test("200: accepts order_by query to change order to descending.", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("200: accepts topic query and filters results by topic if valid", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&topic=cats")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(1);
        expect(response.body.articles[0].topic).toBe("cats");
      });
  });
  test("200: Returns empty array if passed a valid topic but no articles found", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(0);
        expect(response.body.articles).toEqual([]);
      });
  });
  describe("Query errors", () => {
    test("400: Returns error message if supplied non-existent column as sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=colour")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid sort_by query");
        });
    });
    test("400: Returns error message if supplied invalid order", () => {
      return request(app)
        .get("/api/articles?order=cat")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid order query");
        });
    });
    test("400: Returns error message if supplied invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=fish")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid topic query");
        });
    });
  });
});

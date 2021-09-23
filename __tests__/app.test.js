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
        expect(response.body.msg).toBe(
          "inc_votes must be a number. e.g {inc_votes: 1}"
        );
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
  describe("GET /api/articles ERRORS", () => {
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Returns all comments related to passed article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(response.body.comments).toHaveLength(13);
      });
  });
  test("200: Returns empty array if passed an article_id which exists but has no comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(0);
        expect(response.body.comments).toEqual([]);
      });
  });
  test("400: Returns bad request if passed an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong type");
      });
  });
  test("404: Returns not found if passed a valid article_id type but id does not exist", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with updated comment, adds comment to DB", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "I need a nap" })
      .expect(201)
      .then(async (response) => {
        expect(response.body.comment).toEqual({
          comment_id: expect.any(Number),
          body: "I need a nap",
          votes: 0,
          author: "butter_bridge",
          article_id: 2,
          created_at: expect.any(String),
        });

        const articleTwoComments = await db.query(
          `SELECT * FROM comments WHERE article_id = 2`
        );
        expect(articleTwoComments.rows.length).toBe(1);
      });
  });
  test("400: Lets user know if username doesn't exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "12", body: 12 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("User does not exist");
      });
  });
  test("400: Bad request if user includes other properties", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "hi", votes: 2 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Please ONLY provide valid username and body. e.g {username: validUser, body:someText}"
        );
      });
  });
  test("400: Bad request if user does not include username or body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Please provide valid username and body. e.g {username: validUser, body:someText}"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: No content, deletes from DB", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(async (response) => {
        const comments = await db.query(`SELECT * FROM comments;`);
        expect(comments.rows).toHaveLength(17);
      });
  });
  test("400: If comment_id is not a number, bad request", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong type");
      });
  });
  test("404: If comment_id is valid type but not found", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Returns array of users usernames", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toHaveLength(4);
        response.body.users.forEach((user) => {
          expect(user).toEqual({ username: expect.any(String) });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Returns user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        expect(response.body.user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: If user is not found", () => {
    return request(app)
      .get("/api/users/andy")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Increases/decreases votes and returns comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: 17,
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });
});

const express = require("express");
const {
  getArticlesById,
  patchArticleVotes,
  getArticles,
  getArticleComments,
  addArticleComment,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(addArticleComment);
module.exports = articlesRouter;

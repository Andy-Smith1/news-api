const express = require("express");
const {
  getArticlesById,
  patchArticleVotes,
  getArticles,
  getArticleComments,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.patch("/:article_id", patchArticleVotes);

module.exports = articlesRouter;

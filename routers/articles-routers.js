const express = require("express");
const {
  getArticlesById,
  patchArticleVotes,
  getArticles,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.patch("/:article_id", patchArticleVotes);

module.exports = articlesRouter;

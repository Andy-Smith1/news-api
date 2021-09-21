const express = require("express");
const {
  getArticlesById,
  patchArticleVotes,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.patch("/:article_id", patchArticleVotes);

module.exports = articlesRouter;

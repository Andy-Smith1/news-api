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
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.post("/:article_id/comments", addArticleComment);
module.exports = articlesRouter;

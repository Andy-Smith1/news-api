const express = require("express");
const {
  getArticlesById,
  patchArticleVotes,
  getArticles,
  getArticleComments,
  addArticleComment,
  addArticle,
  deleteArticle,
  patchArticleBody,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles).post(addArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(addArticleComment);

articlesRouter.patch("/:article_id/body", patchArticleBody);

module.exports = articlesRouter;

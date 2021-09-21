const express = require("express");
const { getArticlesById } = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticlesById);

module.exports = articlesRouter;

const {
  selectArticlesById,
  updateArticleVotes,
  selectArticles,
  selectArticleComments,
  insertComment,
} = require("../models/articles-models");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVotes = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { body } = req;
    const updatedArticle = await updateArticleVotes(article_id, body);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;
    const articles = await selectArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await selectArticleComments(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.addArticleComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { body } = req;
    const comment = await insertComment(article_id, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

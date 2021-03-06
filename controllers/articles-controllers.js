const {
  selectArticlesById,
  updateArticleVotes,
  selectArticles,
  selectArticleComments,
  insertComment,
  insertArticle,
  removeArticle,
  updateArticleBody,
  selectArticleByTitle,
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
    const { sort_by, order, topic, limit, p, title } = req.query;
    const { articles, totalArticles } = await selectArticles(
      sort_by,
      order,
      topic,
      limit,
      p,
      title
    );
    res.status(200).send({ total_articles: totalArticles, articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { limit, p } = req.query;
    const comments = await selectArticleComments(article_id, limit, p);
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

exports.addArticle = async (req, res, next) => {
  try {
    const { body } = req;
    const newArticle = await insertArticle(body);
    res.status(201).send({ article: newArticle });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const deletedArticle = await removeArticle(article_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchArticleBody = async (req, res, next) => {
  try {
    const { body } = req;
    const { article_id } = req.params;
    const article = await updateArticleBody(article_id, body);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const { selectArticlesById } = require("../models/articles-models");

exports.getArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticlesById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

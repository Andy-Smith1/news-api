const { selectTopics, addTopic } = require("../models/topics-models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    const { body } = req;
    const newTopic = await addTopic(body);
    res.status(201).send({ topic: newTopic });
  } catch (err) {
    next(err);
  }
};

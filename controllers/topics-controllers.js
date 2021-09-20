const { selectTopics } = require("../models/topics-models");

exports.getTopics = async () => {
  const result = await selectTopics();
};

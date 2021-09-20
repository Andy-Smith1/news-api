// extract any functions you are using to manipulate your data, into this file

exports.formatTopics = (topics) => {
  return topics.map((topic) => {
    return [topic.slug, topic.description];
  });
};

exports.formatUsers = (users) => {
  return users.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.formatArticles = (articles) => {
  return articles.map((article) => {
    const { title, topic, author, body, created_at, votes } = article;
    return [title, topic, author, body, created_at, votes];
  });
};

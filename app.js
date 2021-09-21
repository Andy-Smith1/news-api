const express = require("express");
const {
  handleServerError,
  handleCustomErrors,
} = require("./errors/error-handlers.js");
const topicsRouter = require("./routers/topics-routers.js");
const articlesRouter = require("./routers/articles-routers.js");

const app = express();

app.use(express.json());
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handleCustomErrors);
app.use(handleServerError);
module.exports = app;

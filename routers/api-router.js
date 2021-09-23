const express = require("express");
const articlesRouter = require("./articles-routers");
const topicsRouter = require("./topics-routers");
const fs = require("fs/promises");
const commentsRouter = require("./comments-routers");

const apiRouter = express.Router();

//endpoint list
apiRouter.get("/", async (req, res) => {
  const endpoints = await fs.readFile("./endpoints.json", "utf-8");
  res.status(200).send(endpoints);
});

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;

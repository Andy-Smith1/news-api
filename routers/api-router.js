const express = require("express");
const articlesRouter = require("./articles-routers");
const topicsRouter = require("./topics-routers");

const apiRouter = express.Router();

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;

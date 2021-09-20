const express = require("express");
const { handleServerError } = require("./errors/error-handlers.js");
const topicsRouter = require("./routers/topics-routers.js");

const app = express();

app.use(express.json());
app.use("/api/topics", topicsRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handleServerError);
module.exports = app;

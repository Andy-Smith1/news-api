const express = require("express");
const topicsRouter = require("./routers/topics-routers.js");

const app = express();

app.use(express.json());
app.use("/api/topics", topicsRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

module.exports = app;

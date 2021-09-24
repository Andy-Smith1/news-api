const express = require("express");
const {
  handleServerError,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./errors/error-handlers.js");
const apiRouter = require("./routers/api-router.js");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerError);

module.exports = app;

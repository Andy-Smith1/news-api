exports.handleServerError = (err, req, res, next) => {
  if (err) {
    console.log(err, "<<<< unhandled error");
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Wrong data type" });
  } else if (err.code === "23503") {
    res
      .status(404)
      .send({ msg: "An entry does not exist, check usernames/topics" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "All fields required" });
  } else if (err.code === "23505") {
    res.status(400).send({ msg: "Already exists" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

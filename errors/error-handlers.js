exports.handleServerError = (err, req, res, next) => {
  if (err) {
    console.log(err, "<<<< unhandled error");
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid type input" });
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

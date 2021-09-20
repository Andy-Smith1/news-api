exports.handleServerError = (err, res, req, next) => {
  if (err) {
    console.log(err, "<<<< unhandled error");
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

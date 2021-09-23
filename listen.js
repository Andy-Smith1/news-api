const app = require("./app");

// app.listen(9090, () => {
//   console.log("Listening...");
// });

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});

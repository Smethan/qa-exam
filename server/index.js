const express = require("express");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../tictacjs.html"));
});

app.use("/js", express.static(path.join(__dirname, "../tictacjs.js")));
app.use("/css", express.static(path.join(__dirname, "../style.css")));
app.use(
  "/image",
  express.static(path.join(__dirname, "../meta-screenshot.png"))
);

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

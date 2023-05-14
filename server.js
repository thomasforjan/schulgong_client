const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/dist/schulgong-frontend"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/schulgong-frontend/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);

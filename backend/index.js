const express = require("express");
const router = require("./routes");
require("dotenv").config();
const {connectToMongoDB} = require("./database.js");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.use("/api", router);

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}
startServer();

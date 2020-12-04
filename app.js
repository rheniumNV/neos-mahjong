require("dotenv").config();
const express = require("express");
const Main = require("./src/main");

const app = express();
app.set("port", process.env.PORT || 5000);

Main.routes(app);

const server = app.listen(app.get("port"), () => {
  const { host, port } = server.address();
  console.log("Example app listening at http://%s:%s", host, port);
});

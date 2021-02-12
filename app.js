require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const boolParser = require("express-query-boolean");
const util = require("util");

const Main = require("./src/main");

const app = express();
app.set("port", process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(boolParser());

Main.routes(app);

app.use((err, req, res, _next) => {
  console.error(
    util.format(
      "[Error] {0} {1} body={2} error={3}",
      req.method,
      req.url,
      JSON.stringify(req.body),
      err
    )
  );
  res.status(500).send("error").send();
});

app.use((req, res, _next) => {
  console.warn(
    util.format(
      "[Warn] {0} {1} body={2} routeing not found",
      req.method,
      req.url,
      JSON.stringify(req.body)
    )
  );
  res.status(404).send("NotFound").send();
});

const server = app.listen(app.get("port"), () => {
  const { host, port } = server.address();
  console.log("Example app listening at http://%s:%s", host, port);
});

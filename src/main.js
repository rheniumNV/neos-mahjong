const analysis = require("./analysis");

const hello = (_req, res) => {
  res.send("hello");
};

exports.routes = (app) => {
  app.get("/", hello);
  app.get("/v1/analysis", analysis.call);
};

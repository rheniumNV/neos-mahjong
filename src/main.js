const analysis = require("./analysis");
// const ranking = require("./ranking");

const wrap = (path, fn) => [
  path,
  (...args) => {
    const req = args[0];
    console.info("[StartHandle] " + path);
    return fn(...args)
      .catch(args[2])
      .finally(() => {
        console.info("[FinishHandle] " + path);
      });
  },
];

const hello = (_req, res) => {
  res.send("hello");
};

exports.routes = (app) => {
  app.get("/", hello);
  app.get(...wrap("/v1/analysis", async (...args) => analysis.call(...args)));
  app.get(...wrap("/v2/analysis", async (...args) => analysis.callV2(...args)));
  // app.get(...wrap("/v1/ranking", ranking.index));
  // app.post(...wrap("/v1/ranking", ranking.create));
};

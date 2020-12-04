const Riichi = require("riichi");
const _ = require("lodash");

const analysis = (req, res) => {
  const { data } = req.query;
  console.info("request analysis ", data);
  try {
    const result = new Riichi(String(data)).calc();
    res.send(result);
    console.info("[ok] ", result);
  } catch (err) {
    console.error("req:", data, "err:", err);
    res.status(500).send({ error: true });
  }
};

exports.routes = (app) => {
  app.get("/", (_req, res) => {
    res.send("hello");
  });
  app.get("/v1/analysis", analysis);
};

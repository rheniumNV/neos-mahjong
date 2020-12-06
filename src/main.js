const Riichi = require("riichi");
const _ = require("lodash");

const getHairi4Neos = (riichiResult) =>
  _.filter(
    _.keys(_.get(riichiResult, "hairi", {})),
    (k) => !_.includes(["now", "wait"], k)
  );

const getWait4Neos = (riichiResult) =>
  _.keys(_.get(riichiResult, "hairi.wait", {}));

const analysis = (req, res) => {
  const { data } = req.query;
  console.info("request analysis ", data);
  try {
    const riichiResult = new Riichi(String(data)).calc();
    const result = {
      ...riichiResult,
      ...{ hairi4Neos: getHairi4Neos(riichiResult) },
      ...{ wait4Neos: getWait4Neos(riichiResult) },
    };
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

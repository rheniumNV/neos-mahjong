const Riichi = require("riichi");
const _ = require("lodash");

const analysis = (req, res) => {
  const { data } = req.query;
  console.info("request analysis ", data);
  try {
    const result = new Riichi(String(data)).calc();

    // Neos用に欲しい牌だけを配列
    let tmp = eval(result);
    tmp["hairi4Neos"] = Object.keys(tmp.hairi).slice(1);
            
    res.send(tmp);
    console.info("[ok] ", tmp);
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

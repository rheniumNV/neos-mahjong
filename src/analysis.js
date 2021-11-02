const json2emap = require("json2emap");
const Riichi = require("riichi");
const _ = require("lodash");
const { forEach } = require("lodash");

const getHairi4Neos = (riichiResult) =>
  _.filter(
    _.keys(_.get(riichiResult, "hairi", {})),
    (k) => !_.includes(["now", "wait"], k)
  );

const getHairi4Neos713 = (riichiResult) =>
  _.filter(
    _.keys(_.get(riichiResult, "hairi7and13", {})),
    (k) => !_.includes(["now", "wait"], k)
  );

const getAgari4Neos = (riichiResult) =>
  _.get(riichiResult, "hairi.now", -1) == 0
    ? _.keys(_.get(riichiResult, "hairi.wait", {}))
    : [];

const getAgari4Neos713 = (riichiResult) =>
  _.get(riichiResult, "hairi7and13.now", -1) == 0
    ? _.keys(_.get(riichiResult, "hairi7and13.wait", {}))
    : [];

const getWait4Neos = (riichiResult) =>
  _.keys(_.get(riichiResult, "hairi.wait", []));

const getPon4NeosAnalysis = (riichiResult) =>
  _.get(riichiResult, "pon.wait", []);

const getChii4NeosAnalysis = (riichiResult) =>
  _.get(riichiResult, "chi.wait", []);

const getWait4Neos713 = (riichiResult) =>
  _.keys(_.get(riichiResult, "hairi7and13.wait", []));

const generateHaiObject = (number, type) => ({
  number: number == 0 ? 5 : number,
  type: type,
});
const generateHaiObjectFromStr = (str) => {
  const number = _.get(str, "0");
  const type = _.get(str, "1");
  if (_.includes([number, type], null)) return null;
  return generateHaiObject(Number(number), type);
};
const formatHaiObject = (hai) => hai.number + hai.type;
exports.generateHaiObjectFromStr = generateHaiObjectFromStr;
const allHaiObjects = [
  ..._.flatMap(
    _.map(["m", "p", "s"], (type) =>
      _.map(_.range(9), (number) => generateHaiObject(number + 1, type))
    )
  ),
  ..._.map(_.range(7), (number) => generateHaiObject(number + 1, "z")),
];

const isTypeChar = (char) => _.includes(["m", "p", "s", "z"], char);
const getTypeFromIndex = (data, index) =>
  _.find(_.slice(data, index), (char) => isTypeChar(char));
const isNumberChar = (char) => Number(char) >= 0 && Number(char) <= 9;
const typeIndexConvertMap = { m: 0, s: 1, p: 2, z: 3 };
const getSortIndex = ({ number, type }) => [
  _.get(typeIndexConvertMap, type, 100),
  number,
];
const filterNakiString = (data) => _.get(_.split(data, "+"), "0", "");
exports.filterNakiString = filterNakiString;

const parseHaiObject = (data) => {
  const list = _.map(data, (char, index) =>
    isNumberChar(char)
      ? generateHaiObject(Number(char), getTypeFromIndex(data, index))
      : null
  );
  return _.sortBy(
    _.filter(list, (ele) => ele != null),
    getSortIndex
  );
};
exports.parseHaiObject = parseHaiObject;

const getHaiObjectCountList = (haiList) =>
  _.map(
    _.countBy(haiList, (hai) => hai.number + hai.type),
    (count, key) => ({ hai: generateHaiObjectFromStr(key), count: count })
  );

const getPonList = (haiList) =>
  _.map(
    _.filter(
      getHaiObjectCountList(haiList),
      (haiCountData) => haiCountData.count >= 2 && haiCountData.count < 4
    ),
    (haiCountData) => haiCountData.hai
  );
const getPon4Neos = (tehaiList) =>
  _.map(getPonList(tehaiList), formatHaiObject);
exports.getPon4Neos = getPon4Neos;

const getChii4Neos = (tehaiList) => ["4m"];
exports.getChii4Neos = getChii4Neos;

exports.callV2 = (req, res) => {
  const { data, useEmap = false, allowKuitan = true } = req.query;
  console.info("request analysis ", data);
  try {
    const resFormat = {
      isAgari: false,
      error: false,
      isTumo: false,
      han: 0,
      fu: 0,
      ten: 0,
      name: "",
      text: "",
      yaku4Neos: [],
      autoSyanten: 999,
      agariType: "normal",
      autoHairi4Neos: [],
      autoAgari4Neos: [],
      autoWait4Neos: [],
      pon4Neos: [],
      chii4Neos: [],
      ankan4Neos: [],
      minkan4Neos: [],
      toitu4Neos: [],
    };
    const riichi = new Riichi(String(data));
    if (!allowKuitan) {
      riichi.disableKuitan();
    }
    const riichiResult = riichi.calc();
    const tehaiList = parseHaiObject(filterNakiString(data));

    const isTumo = riichi.isTsumo;

    const yaku4Neos = _.map(_.get(riichiResult, "yaku", {}), (value, key) => ({
      name: key,
      han: _.parseInt(_.get(_.split(value, "飜"), "0")),
      hanText: value,
    }));

    const ignore = (number) => (number >= 0 ? number : 999);
    const syanten = ignore(_.get(riichiResult, ["hairi", "now"], -1));
    const syanten713 = ignore(_.get(riichiResult, ["hairi7and13", "now"], -1));
    const agariType = (() => {
      switch (true) {
        case syanten == syanten713:
          return "both";
        case syanten > syanten713:
          return "713";
        case syanten < syanten713:
          return "normal";
        default:
          return "normal";
      }
    })();

    const agariSwitch = (valueNormal, value713, valueBoth) =>
      _.get({ normal: valueNormal, 713: value713, both: valueBoth }, agariType);

    const autoSyanten = agariSwitch(syanten, syanten713, syanten);

    const hairi4Neos = getHairi4Neos(riichiResult);
    const hairi4Neos713 = getHairi4Neos713(riichiResult);
    const autoHairi4Neos = agariSwitch(
      hairi4Neos,
      hairi4Neos713,
      _.uniq(_.concat(hairi4Neos, hairi4Neos713))
    );

    const agari4Neos = getAgari4Neos(riichiResult);
    const agari4Neos713 = getAgari4Neos713(riichiResult);
    const autoAgari4Neos = agariSwitch(
      agari4Neos,
      agari4Neos713,
      _.uniq(_.concat(agari4Neos, agari4Neos713))
    );

    const wait4Neos = getWait4Neos(riichiResult);
    const wait4Neos713 = getWait4Neos713(riichiResult);
    const autoWait4Neos = agariSwitch(
      wait4Neos,
      wait4Neos713,
      _.uniq(_.concat(wait4Neos, wait4Neos713))
    );

    const pon4Noes2 = _.map(
      getPon4NeosAnalysis(riichiResult),
      (value, key) => ({
        value,
        key,
      })
    );

    const pon4Neos = _.map(pon4Noes2, ({ key }) => key);

    const minkan4Neos = _.map(
      _.filter(pon4Noes2, ({ value: { minkan } }) => minkan),
      ({ key }) => key
    );
    const ankan4Neos = _.map(
      _.filter(pon4Noes2, ({ value: { ankan } }) => ankan),
      ({ key }) => key
    );

    const chii4Neos = _.map(
      getChii4NeosAnalysis(riichiResult),
      (value, key) => key
    );

    const toitu4Neos = _.map(
      _.filter(pon4Noes2, ({ value: { minkan, ankan } }) => !minkan && !ankan),
      ({ key }) => key
    );

    const result = {
      ...resFormat,
      ...riichiResult,
      ...{
        isTumo,
        yaku4Neos,
        agariType,
        autoSyanten,
        autoHairi4Neos,
        autoAgari4Neos,
        autoWait4Neos,
        pon4Neos,
        minkan4Neos,
        ankan4Neos,
        chii4Neos,
        toitu4Neos,
      },
    };
    res.send(useEmap ? json2emap(result) : result);
    console.info("[ok] ", result);
  } catch (err) {
    console.error("req:", data, "err:", err);
    res.status(500).send({ error: true });
  }
};

exports.call = (req, res) => {
  const { data, useEmap = false } = req.query;
  console.info("request analysis ", data);
  try {
    const riichiResult = new Riichi(String(data)).calc();
    const tehaiList = parseHaiObject(filterNakiString(data));
    const result = {
      ...riichiResult,
      ...{ hairi4Neos: getHairi4Neos(riichiResult) },
      ...{ agari4Neos: getAgari4Neos(riichiResult) },
      ...{ agari4Neos713: getAgari4Neos713(riichiResult) },
      ...{ wait4Neos: getWait4Neos(riichiResult) },
      ...{ wait4Neos713: getWait4Neos713(riichiResult) },
      ...{ pon4Noes: getPon4Neos(tehaiList) },
      //...{ chii4Noes: getChii4Neos(haiList) },
    };
    res.send(useEmap ? json2emap(result) : result);
    console.info("[ok] ", result);
  } catch (err) {
    console.error("req:", data, "err:", err);
    res.status(500).send({ error: true });
  }
};

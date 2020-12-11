const Riichi = require("riichi");
const _ = require("lodash");
const { forEach } = require("lodash");

const getHairi4Neos = (riichiResult) =>
  _.filter(
    _.keys(_.get(riichiResult, "hairi", {})),
    (k) => !_.includes(["now", "wait"], k)
  );

const getWait4Neos = (riichiResult) =>
  _.keys(_.get(riichiResult, "hairi.wait", {}));

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
const getPon4Neos = (haiList) => _.map(getPonList(haiList), formatHaiObject);
exports.getPon4Neos = getPon4Neos;

const getChii4Neos = (haiList) => ["4m"];
exports.getChii4Neos = getChii4Neos;

exports.call = (req, res) => {
  const { data } = req.query;
  console.info("request analysis ", data);
  try {
    const riichiResult = new Riichi(String(data)).calc();
    const haiList = parseHaiObject(data);
    const result = {
      ...riichiResult,
      ...{ hairi4Neos: getHairi4Neos(riichiResult) },
      ...{ wait4Neos: getWait4Neos(riichiResult) },
      ...{ pon4Noes: getPon4Neos(haiList) },
      //...{ chii4Noes: getChii4Neos(haiList) },
    };
    res.send(result);
    console.info("[ok] ", result);
  } catch (err) {
    console.error("req:", data, "err:", err);
    res.status(500).send({ error: true });
  }
};

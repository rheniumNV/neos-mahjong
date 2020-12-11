const analysis = require("./analysis");
const _ = require("lodash");

//parseHaiObject
const result1 = [
  analysis.generateHaiObjectFromStr("1m"),
  analysis.generateHaiObjectFromStr("2m"),
  analysis.generateHaiObjectFromStr("3m"),
  analysis.generateHaiObjectFromStr("4m"),
  analysis.generateHaiObjectFromStr("5m"),
  analysis.generateHaiObjectFromStr("6m"),
  analysis.generateHaiObjectFromStr("7m"),
  analysis.generateHaiObjectFromStr("8m"),
  analysis.generateHaiObjectFromStr("9m"),
];
const result2 = [
  analysis.generateHaiObjectFromStr("1m"),
  analysis.generateHaiObjectFromStr("2m"),
  analysis.generateHaiObjectFromStr("2z"),
];
const testData4ParseHaiObject = [
  {
    input: "123456789m",
    result: result1,
  },
  {
    input: "123406789m",
    result: result1,
  },
  {
    input: "m2mz49m5ms671m83mp",
    result: result1,
  },
  {
    input: "1m2m2z",
    result: result2,
  },
];
_.forEach(testData4ParseHaiObject, (element) => {
  const { input, result } = element;
  const name = "parseHaiObject " + input + "->" + result;
  test(name, () => {
    expect(analysis.parseHaiObject(input)).toStrictEqual(result);
  });
});

//pon
const testData4Pon = [
  {
    input: "13346m134p",
    result: ["3m"],
  },
  {
    input: "13346m1344p",
    result: ["3m", "4p"],
  },
  {
    input: "1334446m1344p",
    result: ["3m", "4m", "4p"],
  },
];
_.forEach(testData4Pon, (element) => {
  const { input, result } = element;
  const name = "pon " + input + "->" + result;
  const haiList = analysis.parseHaiObject(input);
  test(name, () => {
    expect(analysis.getPon4Neos(haiList)).toStrictEqual(result);
  });
});

//chii
const testData4Chii = [{ input: "123", result: ["4m"] }];
_.forEach(testData4Chii, (element) => {
  const { input, result } = element;
  const name = "chii " + input + "->" + result;
  test(name, () => {
    expect(analysis.getChii4Neos(input)).toStrictEqual(result);
  });
});

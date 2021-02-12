const db = require("../models/index");
const sequelize = require("sequelize");
const _ = require("lodash");
const helper = require("./helper");
const util = require("util");

exports.index = async (req, res, _next) => {
  const gameResults = await db.game_result.findAll({
    include: {
      model: db.user,
      required: false,
    },
  });
  const gameResultsByUser = _.map(
    _.groupBy(gameResults, (gr) => gr.user_id),
    (grList) => ({
      name: grList[0].name,
      time: _.minBy(grList, "time"),
      ten: _.maxBy(grList, "ten"),
    })
  );

  const genRanking = (keyName, sort = "desc") =>
    _.orderBy(
      _.map(gameResultsByUser, (grbu) => _.get(grbu, keyName)),
      keyName,
      sort
    );

  const genRankingNameText = (ranking) =>
    _.join(
      _.map(ranking, (ur, index) =>
        util.format("%d. %s", index + 1, ur.user.name)
      ),
      "\n"
    );
  const genRankingValueText = (ranking, keyName, format = (v) => v) =>
    _.join(
      _.map(ranking, (ur) => util.format("%s", format(_.get(ur, keyName)))),
      "\n"
    );

  const timeRanking = genRanking("time", "asc");
  const timeRankingNameText = genRankingNameText(timeRanking);
  const timeRankingValueText = genRankingValueText(timeRanking, "time", (v) =>
    v.toFixed(1)
  );

  const tenRanking = genRanking("ten", "desc");
  const tenRankingNameText = genRankingNameText(tenRanking);
  const tenRankingValueText = genRankingValueText(tenRanking, "ten");

  res.send({
    timeRankingNameText,
    timeRankingValueText,
    tenRankingNameText,
    tenRankingValueText,
  });
};

exports.create = async (req, res, _next) => {
  const { neos_id, name, game_result } = req.body;
  console.log(game_result);
  var user = await db.user.findOne({ where: { neos_id: neos_id } });

  if (_.isNil(user)) {
    user = await db.user.create({ neos_id, name });
  }

  await db.game_result.create({ ...game_result, ...{ user_id: user.id } });

  const gameResults = await db.game_result.findAll();
  res.send(gameResults);
};

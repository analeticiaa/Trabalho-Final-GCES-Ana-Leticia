var { GameCollection } = require('../gameCollection');

module.exports.fuzz = function(data) {
  var input = data.toString('utf-8');

  var gc = new GameCollection();

  try {
    gc.createGame(input);
  } catch (e) {
    if (e instanceof RangeError) throw e;
  }

  try {
    gc.getGame(input);
  } catch (e) {
    if (e instanceof RangeError) throw e;
  }

  try {
    gc.isFull(input);
  } catch (e) {
    if (e instanceof RangeError) throw e;
  }

  try {
    gc.addPlayer(input, { id: input });
  } catch (e) {
    if (e instanceof RangeError) throw e;
  }
};
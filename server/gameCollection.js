function GameCollection() {
  this.games = {};
}

GameCollection.prototype.createGame = function(name) {
  if (this.games[name]) {
    return false;
  }
  this.games[name] = { players: [] };
  return true;
};

GameCollection.prototype.getGame = function(name) {
  return this.games[name] || null;
};

GameCollection.prototype.addPlayer = function(gameName, player) {
  var game = this.games[gameName];
  if (!game) return false;
  if (game.players.length >= 2) return false;
  game.players.push(player);
  return true;
};

GameCollection.prototype.isFull = function(gameName) {
  var game = this.games[gameName];
  if (!game) return false;
  return game.players.length >= 2;
};

module.exports = { GameCollection };
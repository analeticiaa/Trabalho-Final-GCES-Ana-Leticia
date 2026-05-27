var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    GameCollection = require('./games.js').GameCollection,
    games = new GameCollection(),
    { Pool } = require('pg');

var pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mkjs',
  password: process.env.DB_PASSWORD || 'mkjs123',
  database: process.env.DB_NAME || 'mkjs',
  port: 5432
});

pool.query(`
  CREATE TABLE IF NOT EXISTS partidas (
    id SERIAL PRIMARY KEY,
    jogo VARCHAR(100),
    criado_em TIMESTAMP DEFAULT NOW()
  )
`).then(function() {
  console.log('Tabela partidas pronta.');
}).catch(function(err) {
  console.error('Erro ao criar tabela:', err.message);
});

app.configure(function () {
  app.use(express.static(__dirname + '/../game'));
});

server.listen(55555);

var Responses = {
    SUCCESS: 0,
    GAME_EXISTS: 1,
    GAME_NOT_EXISTS: 2,
    GAME_FULL: 3
  },
  Requests = {
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game'
  };

io.sockets.on('connection', function (socket) {
  socket.on(Requests.CREATE_GAME, function (gameName) {
    if (games.createGame(gameName)) {
      games.getGame(gameName).addPlayer(socket);
      socket.emit('response', Responses.SUCCESS);
      pool.query('INSERT INTO partidas (jogo) VALUES ($1)', [gameName])
        .catch(function(err) { console.error('Erro ao salvar partida:', err.message); });
    } else {
      socket.emit('response', Responses.GAME_EXISTS);
    }
  });
  socket.on(Requests.JOIN_GAME, function (gameName) {
    var game = games.getGame(gameName);
    if (!game) {
      socket.emit('response', Responses.GAME_NOT_EXISTS);
    } else {
      if (game.addPlayer(socket)) {
        socket.emit('response', Responses.SUCCESS);
      } else {
        socket.emit('response', Responses.GAME_FULL);
      }
    }
  });
});
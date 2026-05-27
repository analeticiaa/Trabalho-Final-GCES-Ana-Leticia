var GameCollection = require('../gameCollection').GameCollection;

describe('GameCollection', function() {

  test('deve criar uma partida com sucesso', function() {
    var gc = new GameCollection();
    var resultado = gc.createGame('partida1');
    expect(resultado).toBe(true);
  });

  test('nao deve criar partida com nome duplicado', function() {
    var gc = new GameCollection();
    gc.createGame('partida1');
    var resultado = gc.createGame('partida1');
    expect(resultado).toBe(false);
  });

  test('deve retornar a partida criada', function() {
    var gc = new GameCollection();
    gc.createGame('partida1');
    var partida = gc.getGame('partida1');
    expect(partida).not.toBeNull();
  });

  test('deve retornar null para partida inexistente', function() {
    var gc = new GameCollection();
    var partida = gc.getGame('naoexiste');
    expect(partida).toBeNull();
  });

test('deve retornar false para partida vazia', function() {
    var gc = new GameCollection();
    gc.createGame('partida1');
    var resultado = gc.isFull('partida1');
    expect(resultado).toBe(false);
  });

});
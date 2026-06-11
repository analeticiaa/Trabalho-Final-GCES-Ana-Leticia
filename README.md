# Trabalho Final GCES - Ana Letícia

Repositório do Trabalho Final da disciplina Gerência de Configuração e Evolução de Software (GCES 2026-1): https://github.com/analeticiaa/Trabalho-Final-GCES-Ana-Leticia

A aplicação base é o **mk.js**, um jogo de luta com backend em Node.js/Express e frontend em HTML5 Canvas.

### ✅ Fase 1 - Containerização (DEV)

**Objetivo:** empacotar a aplicação em um container Docker para ambiente de desenvolvimento, com suporte a hot-reload - ou seja, qualquer alteração no código é refletida automaticamente sem precisar reiniciar o container manualmente.

**O que é Docker?**
Docker é uma ferramenta que permite criar ambientes isolados chamados containers. Em vez de instalar o Node.js direto na máquina, o Docker garante que o projeto rode sempre do mesmo jeito em qualquer computador.

**O que é hot-reload?**
É a capacidade do servidor de detectar alterações nos arquivos e reiniciar automaticamente. Para isso foi usado o `nodemon`, uma ferramenta que fica "vigiando" os arquivos e reinicia o Node.js sempre que algo muda.

**O que foi criado:**

Arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package.json ./server/

RUN cd server && npm install && npm install -g nodemon

COPY . .

EXPOSE 55555

WORKDIR /app/server

CMD ["sh", "-c", "npm install && nodemon server.js"]
```

**Explicação linha a linha:**

| Linha | O que faz |
|-------|-----------|
| `FROM node:18-alpine` | Usa uma imagem base do Node.js versão 18, baseada no Alpine Linux (leve e pequena) |
| `WORKDIR /app` | Define `/app` como pasta de trabalho dentro do container |
| `COPY server/package.json ./server/` | Copia o arquivo de dependências antes do código para aproveitar o cache do Docker |
| `RUN cd server && npm install && npm install -g nodemon` | Instala as dependências do projeto e o nodemon globalmente |
| `COPY . .` | Copia todo o código para dentro do container |
| `EXPOSE 55555` | Informa que o container usa a porta 55555 |
| `WORKDIR /app/server` | Muda o diretório de trabalho para a pasta do servidor |
| `CMD [...]` | Comando executado ao iniciar o container: instala dependências e sobe o servidor com hot-reload |

**Como rodar:**

```bash
# Construir a imagem
docker build -t mk-dev .

# Rodar o container com hot-reload
docker run -p 55555:55555 -v $(pwd):/app mk-dev
```

O `-p 55555:55555` mapeia a porta do container para a máquina local.
O `-v $(pwd):/app` monta a pasta do projeto dentro do container, permitindo o hot-reload.

Após rodar, acesse: **http://localhost:55555**

**Resultado:** o jogo mk.js foi carregado com sucesso no navegador e está funcional.

![Fase 1 - Jogo funcionando](img/fase1.png)

# Trabalho Final GCES - Ana Letícia

Repositório do Trabalho Final da disciplina Gerência de Configuração e Evolução de Software (GCES 2026-1): https://github.com/analeticiaa/Trabalho-Final-GCES-Ana-Leticia

A aplicação base é o **mk.js**, um jogo de luta com backend em Node.js/Express e frontend em HTML5 Canvas.

### ✅ Fase 1 - Containerização (DEV)

**Objetivo:** empacotar a aplicação em um container Docker para ambiente de desenvolvimento, com suporte a hot-reload - ou seja, qualquer alteração no código é refletida automaticamente sem precisar reiniciar o container manualmente.

**O que é Docker?**
Docker é uma ferramenta que permite criar ambientes isolados chamados containers. Em vez de instalar o Node.js direto na máquina, o Docker garante que o projeto rode sempre do mesmo jeito em qualquer computador.

**O que é hot-reload?**
É a capacidade do servidor de detectar alterações nos arquivos e reiniciar automaticamente. Para isso foi usado o `nodemon`, uma ferramenta que fica "vigiando" os arquivos e reinicia o Node.js sempre que algo muda.

**O que foi criado:**

Arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package.json ./server/

RUN cd server && npm install && npm install -g nodemon

COPY . .

EXPOSE 55555

WORKDIR /app/server

CMD ["sh", "-c", "npm install && nodemon server.js"]
```

**Explicação linha a linha:**

| Linha | O que faz |
|-------|-----------|
| `FROM node:18-alpine` | Usa uma imagem base do Node.js versão 18, baseada no Alpine Linux (leve e pequena) |
| `WORKDIR /app` | Define `/app` como pasta de trabalho dentro do container |
| `COPY server/package.json ./server/` | Copia o arquivo de dependências antes do código para aproveitar o cache do Docker |
| `RUN cd server && npm install && npm install -g nodemon` | Instala as dependências do projeto e o nodemon globalmente |
| `COPY . .` | Copia todo o código para dentro do container |
| `EXPOSE 55555` | Informa que o container usa a porta 55555 |
| `WORKDIR /app/server` | Muda o diretório de trabalho para a pasta do servidor |
| `CMD [...]` | Comando executado ao iniciar o container: instala dependências e sobe o servidor com hot-reload |

**Como rodar:**

```bash
# Construir a imagem
docker build -t mk-dev .

# Rodar o container com hot-reload
docker run -p 55555:55555 -v $(pwd):/app mk-dev
```

O `-p 55555:55555` mapeia a porta do container para a máquina local.
O `-v $(pwd):/app` monta a pasta do projeto dentro do container, permitindo o hot-reload.

Após rodar, acesse: **http://localhost:55555**

**Resultado:** o jogo mk.js foi carregado com sucesso no navegador e está funcional.

![Fase 1 - Jogo funcionando](img/fase1.png)

**Commit no GitHub:** `feat: adiciona Dockerfile de desenvolvimento com hot-reload`


### ✅ Fase 2 - Docker Compose (DEV)

**Objetivo:** configurar um `docker-compose.yml` que suba a aplicação e um banco de dados Postgres juntos, além de implementar uma camada simples de persistência no código.

**O que é Docker Compose?**
Docker Compose é uma ferramenta que permite definir e rodar múltiplos containers ao mesmo tempo com um único comando. Em vez de subir o servidor e o banco separadamente, o Compose orquestra tudo junto, garantindo que o banco esteja pronto antes da aplicação iniciar.

**O que foi implementado:**

- `docker-compose.yml` com dois serviços: `app` (servidor Node.js) e `db` (Postgres 15)
- O serviço `app` só sobe depois que o banco estiver saudável (`depends_on` com `condition: service_healthy`)
- Variáveis de ambiente para configurar a conexão com o banco
- Volume persistente `pgdata` para que os dados do banco não sejam perdidos ao reiniciar os containers
- O banco roda na porta `5433` para não conflitar com outros serviços
- Camada de persistência no `server.js` usando a biblioteca `pg`: toda vez que uma partida é criada, o nome do jogo é salvo na tabela `partidas` do banco

**Alterações no código:**

`server/package.json` - adicionada dependência `pg` (versão 8.x) para conexão com Postgres.

`server/server.js` - adicionadas as seguintes funcionalidades:
- Conexão com o Postgres via `Pool` usando variáveis de ambiente
- Criação automática da tabela `partidas` ao iniciar o servidor
- Inserção de um registro na tabela sempre que uma partida é criada via socket

**Estrutura do `docker-compose.yml`:**

```yaml
services:
  app:
    build: .
    ports:
      - "55555:55555"
    volumes:
      - .:/app
    environment:
      - DB_HOST=db
      - DB_USER=mkjs
      - DB_PASSWORD=mkjs123
      - DB_NAME=mkjs
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: mkjs
      POSTGRES_PASSWORD: mkjs123
      POSTGRES_DB: mkjs
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mkjs"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Como rodar:**

```bash
**Commit no GitHub:** `feat: adiciona Dockerfile de desenvolvimento com hot-reload`


### ✅ Fase 2 - Docker Compose (DEV)

**Objetivo:** configurar um `docker-compose.yml` que suba a aplicação e um banco de dados Postgres juntos, além de implementar uma camada simples de persistência no código.

**O que é Docker Compose?**
Docker Compose é uma ferramenta que permite definir e rodar múltiplos containers ao mesmo tempo com um único comando. Em vez de subir o servidor e o banco separadamente, o Compose orquestra tudo junto, garantindo que o banco esteja pronto antes da aplicação iniciar.

**O que foi implementado:**

- `docker-compose.yml` com dois serviços: `app` (servidor Node.js) e `db` (Postgres 15)
- O serviço `app` só sobe depois que o banco estiver saudável (`depends_on` com `condition: service_healthy`)
- Variáveis de ambiente para configurar a conexão com o banco
- Volume persistente `pgdata` para que os dados do banco não sejam perdidos ao reiniciar os containers
- O banco roda na porta `5433` para não conflitar com outros serviços
- Camada de persistência no `server.js` usando a biblioteca `pg`: toda vez que uma partida é criada, o nome do jogo é salvo na tabela `partidas` do banco

**Alterações no código:**

`server/package.json` - adicionada dependência `pg` (versão 8.x) para conexão com Postgres.

`server/server.js` - adicionadas as seguintes funcionalidades:
- Conexão com o Postgres via `Pool` usando variáveis de ambiente
- Criação automática da tabela `partidas` ao iniciar o servidor
- Inserção de um registro na tabela sempre que uma partida é criada via socket

**Estrutura do `docker-compose.yml`:**

```yaml
services:
  app:
    build: .
    ports:
      - "55555:55555"
    volumes:
      - .:/app
    environment:
      - DB_HOST=db
      - DB_USER=mkjs
      - DB_PASSWORD=mkjs123
      - DB_NAME=mkjs
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: mkjs
      POSTGRES_PASSWORD: mkjs123
      POSTGRES_DB: mkjs
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mkjs"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Como rodar:**

```bash
docker compose up --build
```

Após rodar, acesse: **http://localhost:55555**

Para verificar os dados salvos no banco:

```bash
docker exec -it trabalho-final-gces-ana-pereira-db-1 psql -U mkjs -d mkjs -c "SELECT * FROM partidas;"
```
![Verificação dos dados salvos](img/verifica-dados.png)

**Resultado:**
- Aplicação e banco sobem juntos com um único comando
- Tabela `partidas` criada automaticamente no Postgres
- Dados de partidas persistidos no banco de dados

![Terminal mostrando Tabela partidas pronta](img/fase2-terminal.png)
![Jogo funcionando com Docker Compose](img/fase2-jogo.png)

**Commits no GitHub:**
- `feat: adiciona docker-compose com Postgres e persistencia de partidas`

### ✅ Fase 3 - CI: Build & Lint

**Objetivo:** Automatizar as etapas de build e lint do projeto via GitHub Actions. O pipeline é executado automaticamente a cada push na branch `main` e falha caso o lint encontre erros no código.

**O que é CI?**
CI significa Integração Contínua. É uma prática em que o código é verificado automaticamente sempre que uma alteração é enviada ao repositório. Isso garante que erros sejam detectados cedo, antes de chegarem à produção.

**O que é lint?**
Lint é uma ferramenta que analisa o código em busca de erros de estilo, variáveis não utilizadas, ponto e vírgula faltando, entre outros problemas. Neste projeto foi utilizado o **ESLint** para o backend em Node.js.

**O que foi criado:**

`.github/workflows/ci.yml` - arquivo de configuração do GitHub Actions com dois jobs:
- `lint-backend`: instala as dependências e roda o ESLint no código do servidor
- `build-frontend`: verifica se os arquivos essenciais do frontend existem (`index.html`, `mk.js`, `styles.css`)

`server/.eslintrc.json` - configuração do ESLint com as seguintes regras:
- `no-unused-vars`: avisa sobre variáveis declaradas mas não usadas
- `no-undef`: erro ao usar variável não declarada
- `semi`: exige ponto e vírgula ao final das instruções
- `no-console`: permite uso de `console.log`

`server/package.json` - adicionado:
- `eslint` como dependência de desenvolvimento
- Scripts `lint` e `dev` para facilitar o uso local

**Estrutura do pipeline:**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-backend:   # roda ESLint no servidor
  build-frontend: # verifica arquivos do frontend
```

**Como rodar o lint localmente:**

```bash
cd server
npm install
npm run lint
```
docker compose up --build
```

Após rodar, acesse: **http://localhost:55555**

Para verificar os dados salvos no banco:

```bash
docker exec -it trabalho-final-gces-ana-pereira-db-1 psql -U mkjs -d mkjs -c "SELECT * FROM partidas;"
```
![Verificação dos dados salvos](img/verifica-dados.png)

**Resultado:**
- Aplicação e banco sobem juntos com um único comando
- Tabela `partidas` criada automaticamente no Postgres
- Dados de partidas persistidos no banco de dados

![Terminal mostrando Tabela partidas pronta](img/fase2-terminal.png)
![Jogo funcionando com Docker Compose](img/fase2-jogo.png)

**Commits no GitHub:**
- `feat: adiciona docker-compose com Postgres e persistencia de partidas`

### ✅ Fase 3 - CI: Build & Lint

**Objetivo:** Automatizar as etapas de build e lint do projeto via GitHub Actions. O pipeline é executado automaticamente a cada push na branch `main` e falha caso o lint encontre erros no código.

**O que é CI?**
CI significa Integração Contínua. É uma prática em que o código é verificado automaticamente sempre que uma alteração é enviada ao repositório. Isso garante que erros sejam detectados cedo, antes de chegarem à produção.

**O que é lint?**
Lint é uma ferramenta que analisa o código em busca de erros de estilo, variáveis não utilizadas, ponto e vírgula faltando, entre outros problemas. Neste projeto foi utilizado o **ESLint** para o backend em Node.js.

**O que foi criado:**

`.github/workflows/ci.yml` - arquivo de configuração do GitHub Actions com dois jobs:
- `lint-backend`: instala as dependências e roda o ESLint no código do servidor
- `build-frontend`: verifica se os arquivos essenciais do frontend existem (`index.html`, `mk.js`, `styles.css`)

`server/.eslintrc.json` - configuração do ESLint com as seguintes regras:
- `no-unused-vars`: avisa sobre variáveis declaradas mas não usadas
- `no-undef`: erro ao usar variável não declarada
- `semi`: exige ponto e vírgula ao final das instruções
- `no-console`: permite uso de `console.log`

`server/package.json` - adicionado:
- `eslint` como dependência de desenvolvimento
- Scripts `lint` e `dev` para facilitar o uso local

**Estrutura do pipeline:**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-backend:   # roda ESLint no servidor
  build-frontend: # verifica arquivos do frontend
```

**Como rodar o lint localmente:**

```bash
cd server
npm install
npm run lint
```

**Resultado:**
- Pipeline executado automaticamente no GitHub Actions a cada push
- Build e lint passando com sucesso
- Pipeline falha automaticamente se o lint encontrar erros

![Pipeline CI passando no GitHub Actions](img/fase3-pipeline.png)

**Commit no GitHub:** `feat: adiciona pipeline de CI com build e lint`

### ✅ Fase 4 - CI: Testes Unitários

**Objetivo:** implementar testes unitários funcionais e integrá-los ao pipeline de CI. O requisito obrigatório desta fase é demonstrar o teste quebrando no CI e depois passando após a correção.

**O que são testes unitários?**
Testes unitários verificam partes isoladas do código - uma função ou um módulo - para garantir que cada peça funciona corretamente sozinha. Eles rodam automaticamente no pipeline e impedem que código quebrado chegue à produção.

**O que foi criado:**

`server/gameCollection.js` - módulo isolado com a lógica de gerenciamento de partidas, extraído do `server.js` para facilitar os testes. Contém as funções:
- `createGame(name)`: cria uma nova partida, retorna `false` se já existir
- `getGame(name)`: retorna a partida ou `null` se não existir
- `addPlayer(gameName, player)`: adiciona jogador à partida, máximo 2
- `isFull(gameName)`: retorna `true` se a partida já tiver 2 jogadores

`server/tests/gameCollection.test.js` - arquivo de testes com 5 casos usando o framework **Jest**.

`.github/workflows/ci.yml` - atualizado com novo job `testes-unitarios` que instala as dependências e roda `npm test`.

**Sequência de commits (requisito obrigatório da fase):**

| Commit | O que acontece no CI |
|--------|---------------------|
| `test: adiciona testes unitarios (com teste quebrado para demonstracao)` | Pipeline falha ❌ - teste quebrado de propósito |
| `fix: corrige teste quebrado e adiciona job de testes no pipeline` | Pipeline passa ✅ - teste corrigido |

Essa sequência demonstra que o CI realmente detecta falhas nos testes antes de aceitar o código.

**Como rodar os testes localmente:**

```bash
cd server
npm install
npm test
```

**Resultado esperado:**

PASS tests/gameCollection.test.js

GameCollection

✓ deve criar uma partida com sucesso

✓ nao deve criar partida com nome duplicado

✓ deve retornar a partida criada

✓ deve retornar null para partida inexistente

✓ deve retornar false para partida vazia

Test Suites: 1 passed, 1 total

Tests:       5 passed, 5 total

**Resultado:**
- Testes unitários integrados ao pipeline de CI
- CI falha automaticamente quando um teste quebra
- CI passa após correção do teste

**Resultado:**
- Pipeline executado automaticamente no GitHub Actions a cada push
- Build e lint passando com sucesso
- Pipeline falha automaticamente se o lint encontrar erros

![Pipeline CI passando no GitHub Actions](img/fase3-pipeline.png)

**Commit no GitHub:** `feat: adiciona pipeline de CI com build e lint`

### ✅ Fase 4 - CI: Testes Unitários

**Objetivo:** implementar testes unitários funcionais e integrá-los ao pipeline de CI. O requisito obrigatório desta fase é demonstrar o teste quebrando no CI e depois passando após a correção.

**O que são testes unitários?**
Testes unitários verificam partes isoladas do código - uma função ou um módulo - para garantir que cada peça funciona corretamente sozinha. Eles rodam automaticamente no pipeline e impedem que código quebrado chegue à produção.

**O que foi criado:**

`server/gameCollection.js` - módulo isolado com a lógica de gerenciamento de partidas, extraído do `server.js` para facilitar os testes. Contém as funções:
- `createGame(name)`: cria uma nova partida, retorna `false` se já existir
- `getGame(name)`: retorna a partida ou `null` se não existir
- `addPlayer(gameName, player)`: adiciona jogador à partida, máximo 2
- `isFull(gameName)`: retorna `true` se a partida já tiver 2 jogadores

`server/tests/gameCollection.test.js` - arquivo de testes com 5 casos usando o framework **Jest**.

`.github/workflows/ci.yml` - atualizado com novo job `testes-unitarios` que instala as dependências e roda `npm test`.

**Sequência de commits (requisito obrigatório da fase):**

| Commit | O que acontece no CI |
|--------|---------------------|
| `test: adiciona testes unitarios (com teste quebrado para demonstracao)` | Pipeline falha ❌ - teste quebrado de propósito |
| `fix: corrige teste quebrado e adiciona job de testes no pipeline` | Pipeline passa ✅ - teste corrigido |

Essa sequência demonstra que o CI realmente detecta falhas nos testes antes de aceitar o código.

**Como rodar os testes localmente:**

```bash
cd server
npm install
npm test
```

**Resultado esperado:**

PASS tests/gameCollection.test.js

GameCollection

✓ deve criar uma partida com sucesso

✓ nao deve criar partida com nome duplicado

✓ deve retornar a partida criada

✓ deve retornar null para partida inexistente

✓ deve retornar false para partida vazia

Test Suites: 1 passed, 1 total

Tests:       5 passed, 5 total

**Resultado:**
- Testes unitários integrados ao pipeline de CI
- CI falha automaticamente quando um teste quebra
- CI passa após correção do teste

![Pipeline falhando com teste quebrado](img/fase4-teste-quebrado.png)
![Pipeline passando após correção](img/fase4-teste-passando.png)

**Commits no GitHub:**
- `test: adiciona testes unitarios (com teste quebrado para demonstracao)`
- `fix: corrige teste quebrado e adiciona job de testes no pipeline`

### ✅ Fase 5 - CI: Fuzzing

**Objetivo:** adicionar testes de fuzzing ao pipeline de CI para verificar se o servidor se comporta de forma segura ao receber entradas inesperadas, aleatórias ou malformadas.

**O que é Fuzzing?**
Fuzzing é uma técnica de teste automatizado que envia entradas aleatórias, inválidas ou inesperadas para um sistema para detectar comportamentos não previstos, como crashes, loops infinitos ou vazamentos de memória. É amplamente usada em segurança de software para encontrar vulnerabilidades antes que atacantes o façam.

**Diferença entre fuzzing e testes unitários:**

| Testes Unitários | Fuzzing |
|-----------------|---------|
| Entradas definidas pelo desenvolvedor | Entradas geradas automaticamente e aleatoriamente |
| Verifica comportamentos esperados | Descobre comportamentos inesperados |
| Cobertura limitada ao que foi pensado | Pode encontrar casos que o desenvolvedor não previu |

**O que foi criado:**

`server/fuzz/gameCollection.fuzz.js` - arquivo de fuzzing que usa o **Jazzer.js** para enviar entradas aleatórias às funções do módulo `gameCollection`:
- `createGame(input)`: recebe strings aleatórias como nome de partida
- `getGame(input)`: tenta buscar partidas com nomes aleatórios
- `isFull(input)`: verifica se partidas com nomes aleatórios estão cheias
- `addPlayer(input, player)`: tenta adicionar jogadores com dados aleatórios

O fuzzer roda por **30 segundos** no pipeline e encerra sem falhar caso não encontre crashes - o que é o comportamento esperado.

`server/fuzz/run-fuzz.sh` - script auxiliar para rodar o fuzzing localmente.

`.github/workflows/ci.yml` - atualizado com novo job `fuzzing` que instala o Jazzer.js e roda o fuzzer por 30 segundos.

**Ferramenta utilizada:**
- **Jazzer.js** (`@jazzer.js/core`): biblioteca de fuzzing para JavaScript baseada no LibFuzzer, desenvolvida pela Code Intelligence.

**Como rodar o fuzzing localmente:**

```bash
cd server
npm install
npx jazzer fuzz/gameCollection.fuzz.js \
  --instrumentation_includes="gameCollection" \
  -- -max_total_time=30
```

**Resultado:**
- Fuzzing rodando automaticamente no pipeline a cada push
- Nenhum crash encontrado nas funções testadas
- Pipeline completo com 4 jobs: Lint, Build Frontend, Testes Unitários e Fuzzing

![Pipeline com fuzzing passando](img/fase5-fuzzing.png)

**Commit no GitHub:** `feat: adiciona fuzzing no pipeline de CI`

### ✅ Fase 6 — CI: Análise de Segurança (SAST/SCA)

**Objetivo:** adicionar ferramentas de análise de segurança ao pipeline de CI para identificar vulnerabilidades no código fonte e nas dependências do projeto.

**O que é SAST?**
SAST (Static Application Security Testing) analisa o código fonte **sem executá-lo**, procurando padrões conhecidos de vulnerabilidades como uso de `eval()`, senhas hardcoded, injeção de SQL, entre outros. É como uma revisão de código automatizada com foco em segurança.

**O que é SCA?**
SCA (Software Composition Analysis) verifica as **dependências externas** do projeto (bibliotecas instaladas via npm) em busca de vulnerabilidades conhecidas registradas em bases de dados públicas como o CVE (Common Vulnerabilities and Exposures).

**Diferença entre SAST e SCA:**

![Pipeline falhando com teste quebrado](img/fase4-teste-quebrado.png)
![Pipeline passando após correção](img/fase4-teste-passando.png)

**Commits no GitHub:**
- `test: adiciona testes unitarios (com teste quebrado para demonstracao)`
- `fix: corrige teste quebrado e adiciona job de testes no pipeline`

### ✅ Fase 5 - CI: Fuzzing

**Objetivo:** adicionar testes de fuzzing ao pipeline de CI para verificar se o servidor se comporta de forma segura ao receber entradas inesperadas, aleatórias ou malformadas.

**O que é Fuzzing?**
Fuzzing é uma técnica de teste automatizado que envia entradas aleatórias, inválidas ou inesperadas para um sistema para detectar comportamentos não previstos, como crashes, loops infinitos ou vazamentos de memória. É amplamente usada em segurança de software para encontrar vulnerabilidades antes que atacantes o façam.

**Diferença entre fuzzing e testes unitários:**

| Testes Unitários | Fuzzing |
|-----------------|---------|
| Entradas definidas pelo desenvolvedor | Entradas geradas automaticamente e aleatoriamente |
| Verifica comportamentos esperados | Descobre comportamentos inesperados |
| Cobertura limitada ao que foi pensado | Pode encontrar casos que o desenvolvedor não previu |

**O que foi criado:**

`server/fuzz/gameCollection.fuzz.js` - arquivo de fuzzing que usa o **Jazzer.js** para enviar entradas aleatórias às funções do módulo `gameCollection`:
- `createGame(input)`: recebe strings aleatórias como nome de partida
- `getGame(input)`: tenta buscar partidas com nomes aleatórios
- `isFull(input)`: verifica se partidas com nomes aleatórios estão cheias
- `addPlayer(input, player)`: tenta adicionar jogadores com dados aleatórios

O fuzzer roda por **30 segundos** no pipeline e encerra sem falhar caso não encontre crashes - o que é o comportamento esperado.

`server/fuzz/run-fuzz.sh` - script auxiliar para rodar o fuzzing localmente.

`.github/workflows/ci.yml` - atualizado com novo job `fuzzing` que instala o Jazzer.js e roda o fuzzer por 30 segundos.

**Ferramenta utilizada:**
- **Jazzer.js** (`@jazzer.js/core`): biblioteca de fuzzing para JavaScript baseada no LibFuzzer, desenvolvida pela Code Intelligence.

**Como rodar o fuzzing localmente:**

```bash
cd server
npm install
npx jazzer fuzz/gameCollection.fuzz.js \
  --instrumentation_includes="gameCollection" \
  -- -max_total_time=30
```

**Resultado:**
- Fuzzing rodando automaticamente no pipeline a cada push
- Nenhum crash encontrado nas funções testadas
- Pipeline completo com 4 jobs: Lint, Build Frontend, Testes Unitários e Fuzzing

![Pipeline com fuzzing passando](img/fase5-fuzzing.png)

**Commit no GitHub:** `feat: adiciona fuzzing no pipeline de CI`

### ✅ Fase 6 — CI: Análise de Segurança (SAST/SCA)

**Objetivo:** adicionar ferramentas de análise de segurança ao pipeline de CI para identificar vulnerabilidades no código fonte e nas dependências do projeto.

**O que é SAST?**
SAST (Static Application Security Testing) analisa o código fonte **sem executá-lo**, procurando padrões conhecidos de vulnerabilidades como uso de `eval()`, senhas hardcoded, injeção de SQL, entre outros. É como uma revisão de código automatizada com foco em segurança.

**O que é SCA?**
SCA (Software Composition Analysis) verifica as **dependências externas** do projeto (bibliotecas instaladas via npm) em busca de vulnerabilidades conhecidas registradas em bases de dados públicas como o CVE (Common Vulnerabilities and Exposures).

**Diferença entre SAST e SCA:**

| SAST | SCA |
|------|-----|
| Analisa o código que você escreveu | Analisa as bibliotecas que você usa |
| Detecta más práticas de segurança | Detecta dependências com CVEs conhecidos |
| Ferramenta: Semgrep | Ferramenta: npm audit |

**O que foi criado:**

`.semgrep.yml` — arquivo de configuração do Semgrep com 3 regras customizadas:
- `no-eval`: detecta uso de `eval()`, que pode causar injeção de código
- `no-hardcoded-passwords`: alerta sobre possíveis senhas escritas diretamente no código
- `sql-injection-risk`: detecta concatenações inseguras que podem causar SQL injection

`.github/workflows/ci.yml` — atualizado com dois novos jobs:

**Job `sast`:**
- Usa a action oficial do Semgrep (`returntocorp/semgrep-action`)
- Roda as regras customizadas do `.semgrep.yml`
- Roda também as regras padrão de segurança do Semgrep para JavaScript
- Configurado com `continue-on-error: true` pois o projeto usa dependências legadas

**Job `sca`:**
- Roda `npm audit` para verificar vulnerabilidades nas dependências
- Gera um relatório em JSON (`audit-report.json`)
- Salva o relatório como artefato para download no GitHub Actions
- As vulnerabilidades encontradas são das dependências legadas do projeto (Express 3.x, Socket.io 0.9.x) — conhecidas e documentadas

**Por que o pipeline não falha mesmo com vulnerabilidades?**
O projeto usa dependências antigas intencionalmente (é parte do contexto da disciplina). As vulnerabilidades encontradas pelo `npm audit` são conhecidas e foram documentadas. O objetivo desta fase é **detectar e reportar**, não necessariamente corrigir todas as vulnerabilidades das dependências legadas.

**Pipeline completo após Fase 6:**

```
CI - Build, Lint, Testes, Fuzzing e Segurança
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
└── ✅ SCA - Auditoria de Dependências
```

**Como rodar localmente:**

```bash
# SAST - requer Python instalado
pip install semgrep
semgrep --config=.semgrep.yml server/

# SCA
cd server
npm audit
```

**Resultado:**
- Análise estática do código rodando automaticamente a cada push
- Relatório de vulnerabilidades das dependências gerado e salvo como artefato
- Nenhuma vulnerabilidade crítica no código desenvolvido no projeto
- Vulnerabilidades das dependências legadas identificadas e documentadas

![Pipeline completo passando](img/fase6-pipeline.png)
![Relatório de auditoria de dependências](img/fase6-sca-relatorio.png)

**Commit no GitHub:** `feat: adiciona analise de seguranca SAST e SCA no pipeline`

### ✅ Fase 7 — Qualidade de Código com SonarCloud

**Objetivo:** integrar o SonarCloud ao pipeline de CI para medir e monitorar automaticamente a qualidade do código a cada push, analisando métricas como cobertura de testes, bugs, code smells e duplicações.


| SAST | SCA |
|------|-----|
| Analisa o código que você escreveu | Analisa as bibliotecas que você usa |
| Detecta más práticas de segurança | Detecta dependências com CVEs conhecidos |
| Ferramenta: Semgrep | Ferramenta: npm audit |

**O que foi criado:**

`.semgrep.yml` — arquivo de configuração do Semgrep com 3 regras customizadas:
- `no-eval`: detecta uso de `eval()`, que pode causar injeção de código
- `no-hardcoded-passwords`: alerta sobre possíveis senhas escritas diretamente no código
- `sql-injection-risk`: detecta concatenações inseguras que podem causar SQL injection

`.github/workflows/ci.yml` — atualizado com dois novos jobs:

**Job `sast`:**
- Usa a action oficial do Semgrep (`returntocorp/semgrep-action`)
- Roda as regras customizadas do `.semgrep.yml`
- Roda também as regras padrão de segurança do Semgrep para JavaScript
- Configurado com `continue-on-error: true` pois o projeto usa dependências legadas

**Job `sca`:**
- Roda `npm audit` para verificar vulnerabilidades nas dependências
- Gera um relatório em JSON (`audit-report.json`)
- Salva o relatório como artefato para download no GitHub Actions
- As vulnerabilidades encontradas são das dependências legadas do projeto (Express 3.x, Socket.io 0.9.x) — conhecidas e documentadas

**Por que o pipeline não falha mesmo com vulnerabilidades?**
O projeto usa dependências antigas intencionalmente (é parte do contexto da disciplina). As vulnerabilidades encontradas pelo `npm audit` são conhecidas e foram documentadas. O objetivo desta fase é **detectar e reportar**, não necessariamente corrigir todas as vulnerabilidades das dependências legadas.

**Pipeline completo após Fase 6:**

```
CI - Build, Lint, Testes, Fuzzing e Segurança
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
└── ✅ SCA - Auditoria de Dependências
```

**Como rodar localmente:**

```bash
# SAST - requer Python instalado
pip install semgrep
semgrep --config=.semgrep.yml server/

# SCA
cd server
npm audit
```

**Resultado:**
- Análise estática do código rodando automaticamente a cada push
- Relatório de vulnerabilidades das dependências gerado e salvo como artefato
- Nenhuma vulnerabilidade crítica no código desenvolvido no projeto
- Vulnerabilidades das dependências legadas identificadas e documentadas

![Pipeline completo passando](img/fase6-pipeline.png)
![Relatório de auditoria de dependências](img/fase6-sca-relatorio.png)

**Commit no GitHub:** `feat: adiciona analise de seguranca SAST e SCA no pipeline`

### ✅ Fase 7 — Qualidade de Código com SonarCloud

**Objetivo:** integrar o SonarCloud ao pipeline de CI para medir e monitorar automaticamente a qualidade do código a cada push, analisando métricas como cobertura de testes, bugs, code smells e duplicações.

**O que é o SonarCloud?**
SonarCloud é uma plataforma de análise contínua de qualidade de código. Ele inspeciona o código automaticamente e gera um relatório com métricas objetivas, ajudando a identificar problemas antes que eles se acumulem e se tornem difíceis de corrigir.

**Métricas analisadas pelo SonarCloud:**

| Métrica | O que significa |
|---------|----------------|
| **Bugs** | Erros no código que podem causar comportamento inesperado |
| **Vulnerabilidades** | Falhas de segurança no código desenvolvido |
| **Code Smells** | Trechos de código que funcionam mas são difíceis de manter |
| **Cobertura** | Percentual do código coberto pelos testes unitários |
| **Duplicações** | Trechos de código repetidos desnecessariamente |
| **Quality Gate** | Nota geral que indica se o projeto passa ou não nos critérios mínimos de qualidade |

**O que foi criado:**

`sonar-project.properties` — arquivo de configuração do SonarCloud com:
- Chave e nome do projeto
- Pastas de código fonte analisadas (`server` e `game`)
- Exclusão de `node_modules` e arquivos de fuzzing
- Caminho do relatório de cobertura gerado pelo Jest

`server/package.json` — atualizado para gerar relatório de cobertura no formato `lcov` a cada execução dos testes, necessário para o SonarCloud medir a cobertura.

`.github/workflows/ci.yml` — adicionado job `sonarcloud` que:
- Roda após os testes unitários (`needs: testes-unitarios`)
- Gera o relatório de cobertura com `npm test`
- Envia os dados para o SonarCloud usando o `SONAR_TOKEN` configurado nos secrets do GitHub

**Configuração de segredos:**
O `SONAR_TOKEN` foi configurado como secret no repositório GitHub em **Settings → Secrets and variables → Actions** para não expor a chave no código.

**Pipeline completo após Fase 7:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
└── ✅ SonarCloud - Qualidade de Código

```

**Como visualizar os resultados:**
Acesse **sonarcloud.io** e selecione o projeto para ver o dashboard completo com todas as métricas.

**Resultado:**
- Análise de qualidade de código integrada ao pipeline
- Relatório de cobertura de testes enviado automaticamente ao SonarCloud
- Dashboard de qualidade disponível em tempo real no SonarCloud

![Dashboard do SonarCloud](img/sonar-dash.png)

**Commit no GitHub:** `feat: adiciona analise de qualidade de codigo com SonarCloud`

### ✅ Fase 8 — Container Otimizado para Produção

**Objetivo:** criar uma imagem Docker otimizada para produção usando multi-stage build, separando o ambiente de desenvolvimento do de produção, e servir o frontend com Nginx.

**O que é multi-stage build?**
É uma técnica do Docker onde o `Dockerfile` é dividido em múltiplas etapas. Cada etapa tem um propósito específico e apenas os artefatos necessários são copiados para a etapa seguinte. O resultado é uma imagem final muito menor, mais segura e sem ferramentas desnecessárias expostas.

**O que é Nginx?**
Nginx é um servidor web de alta performance. Em vez de servir os arquivos estáticos do frontend direto pelo Node.js, usamos o Nginx que é especializado nisso — mais rápido, com suporte a compressão, cache e configurações de segurança.

**Diferença entre ambiente de desenvolvimento e produção:**

**O que é o SonarCloud?**
SonarCloud é uma plataforma de análise contínua de qualidade de código. Ele inspeciona o código automaticamente e gera um relatório com métricas objetivas, ajudando a identificar problemas antes que eles se acumulem e se tornem difíceis de corrigir.

**Métricas analisadas pelo SonarCloud:**

| Métrica | O que significa |
|---------|----------------|
| **Bugs** | Erros no código que podem causar comportamento inesperado |
| **Vulnerabilidades** | Falhas de segurança no código desenvolvido |
| **Code Smells** | Trechos de código que funcionam mas são difíceis de manter |
| **Cobertura** | Percentual do código coberto pelos testes unitários |
| **Duplicações** | Trechos de código repetidos desnecessariamente |
| **Quality Gate** | Nota geral que indica se o projeto passa ou não nos critérios mínimos de qualidade |

**O que foi criado:**

`sonar-project.properties` — arquivo de configuração do SonarCloud com:
- Chave e nome do projeto
- Pastas de código fonte analisadas (`server` e `game`)
- Exclusão de `node_modules` e arquivos de fuzzing
- Caminho do relatório de cobertura gerado pelo Jest

`server/package.json` — atualizado para gerar relatório de cobertura no formato `lcov` a cada execução dos testes, necessário para o SonarCloud medir a cobertura.

`.github/workflows/ci.yml` — adicionado job `sonarcloud` que:
- Roda após os testes unitários (`needs: testes-unitarios`)
- Gera o relatório de cobertura com `npm test`
- Envia os dados para o SonarCloud usando o `SONAR_TOKEN` configurado nos secrets do GitHub

**Configuração de segredos:**
O `SONAR_TOKEN` foi configurado como secret no repositório GitHub em **Settings → Secrets and variables → Actions** para não expor a chave no código.

**Pipeline completo após Fase 7:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
└── ✅ SonarCloud - Qualidade de Código

```

**Como visualizar os resultados:**
Acesse **sonarcloud.io** e selecione o projeto para ver o dashboard completo com todas as métricas.

**Resultado:**
- Análise de qualidade de código integrada ao pipeline
- Relatório de cobertura de testes enviado automaticamente ao SonarCloud
- Dashboard de qualidade disponível em tempo real no SonarCloud

![Dashboard do SonarCloud](img/sonar-dash.png)

**Commit no GitHub:** `feat: adiciona analise de qualidade de codigo com SonarCloud`

### ✅ Fase 8 — Container Otimizado para Produção

**Objetivo:** criar uma imagem Docker otimizada para produção usando multi-stage build, separando o ambiente de desenvolvimento do de produção, e servir o frontend com Nginx.

**O que é multi-stage build?**
É uma técnica do Docker onde o `Dockerfile` é dividido em múltiplas etapas. Cada etapa tem um propósito específico e apenas os artefatos necessários são copiados para a etapa seguinte. O resultado é uma imagem final muito menor, mais segura e sem ferramentas desnecessárias expostas.

**O que é Nginx?**
Nginx é um servidor web de alta performance. Em vez de servir os arquivos estáticos do frontend direto pelo Node.js, usamos o Nginx que é especializado nisso — mais rápido, com suporte a compressão, cache e configurações de segurança.

**Diferença entre ambiente de desenvolvimento e produção:**

| | Desenvolvimento | Produção |
|--|----------------|----------|
| **Dockerfile** | `Dockerfile` | `Dockerfile.prod` |
| **Compose** | `docker-compose.yml` | `docker-compose.prod.yml` |
| **Hot-reload** | ✅ nodemon | ❌ node direto |
| **Frontend** | Servido pelo Node.js | Servido pelo Nginx |
| **Dependências de dev** | Instaladas | Omitidas (`--omit=dev`) |
| **Usuário no container** | root | usuário sem privilégios |

**O que foi criado:**

`Dockerfile.prod` — Dockerfile com 3 etapas:
- **Etapa 1 (`backend-build`)**: instala apenas dependências de produção (`--omit=dev`)
- **Etapa 2 (`frontend`)**: copia os arquivos estáticos do jogo para o Nginx
- **Etapa 3 (`production`)**: imagem final com o backend rodando com usuário sem privilégios por segurança

`nginx.conf` — configuração do Nginx com:
- Serve os arquivos do frontend na porta 80
- Cache de 1 ano para arquivos estáticos (JS, CSS, imagens)
- Compressão gzip ativada para reduzir o tamanho das respostas

`docker-compose.prod.yml` — orquestração dos serviços de produção:
- `backend`: servidor Node.js em modo produção
- `frontend`: Nginx servindo os arquivos do jogo
- `db`: Postgres com volume persistente
- Todos com `restart: unless-stopped` para reiniciar automaticamente em caso de falha

`.github/workflows/ci.yml` — adicionado job `build-producao` que:
- Usa Docker Buildx para build otimizado
- Builda as imagens de backend e frontend de produção
- Verifica o tamanho das imagens geradas

**Pipeline completo após Fase 8:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
├── ✅ SonarCloud - Qualidade de Código
└── ✅ Build de Produção

```

**Como rodar em produção localmente:**

```bash
# Subir ambiente de produção
docker compose -f docker-compose.prod.yml up --build

# Backend disponível em:
# http://localhost:55555

# Frontend via Nginx disponível em:
# http://localhost:80
```

**Resultado:**
- Imagem de produção otimizada com multi-stage build
- Frontend servido pelo Nginx com cache e compressão
- Backend rodando sem dependências de desenvolvimento
- Container de produção executando com usuário sem privilégios (segurança)

![Frontend via Nginx rodando](img/fase8-frontend.png)
![Pipeline completo passando](img/fase8-terminal.png)

**Commit no GitHub:** `feat: adiciona Dockerfile multi-stage e Nginx para producao`
| | Desenvolvimento | Produção |
|--|----------------|----------|
| **Dockerfile** | `Dockerfile` | `Dockerfile.prod` |
| **Compose** | `docker-compose.yml` | `docker-compose.prod.yml` |
| **Hot-reload** | ✅ nodemon | ❌ node direto |
| **Frontend** | Servido pelo Node.js | Servido pelo Nginx |
| **Dependências de dev** | Instaladas | Omitidas (`--omit=dev`) |
| **Usuário no container** | root | usuário sem privilégios |

**O que foi criado:**

`Dockerfile.prod` — Dockerfile com 3 etapas:
- **Etapa 1 (`backend-build`)**: instala apenas dependências de produção (`--omit=dev`)
- **Etapa 2 (`frontend`)**: copia os arquivos estáticos do jogo para o Nginx
- **Etapa 3 (`production`)**: imagem final com o backend rodando com usuário sem privilégios por segurança

`nginx.conf` — configuração do Nginx com:
- Serve os arquivos do frontend na porta 80
- Cache de 1 ano para arquivos estáticos (JS, CSS, imagens)
- Compressão gzip ativada para reduzir o tamanho das respostas

`docker-compose.prod.yml` — orquestração dos serviços de produção:
- `backend`: servidor Node.js em modo produção
- `frontend`: Nginx servindo os arquivos do jogo
- `db`: Postgres com volume persistente
- Todos com `restart: unless-stopped` para reiniciar automaticamente em caso de falha

`.github/workflows/ci.yml` — adicionado job `build-producao` que:
- Usa Docker Buildx para build otimizado
- Builda as imagens de backend e frontend de produção
- Verifica o tamanho das imagens geradas

**Pipeline completo após Fase 8:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
├── ✅ SonarCloud - Qualidade de Código
└── ✅ Build de Produção

```

**Como rodar em produção localmente:**

```bash
# Subir ambiente de produção
docker compose -f docker-compose.prod.yml up --build

# Backend disponível em:
# http://localhost:55555

# Frontend via Nginx disponível em:
# http://localhost:80
```

**Resultado:**
- Imagem de produção otimizada com multi-stage build
- Frontend servido pelo Nginx com cache e compressão
- Backend rodando sem dependências de desenvolvimento
- Container de produção executando com usuário sem privilégios (segurança)

![Frontend via Nginx rodando](img/fase8-frontend.png)
![Pipeline completo passando](img/fase8-terminal.png)

**Commit no GitHub:** `feat: adiciona Dockerfile multi-stage e Nginx para producao`

### ✅ Fase 9 — Orquestração com Kubernetes (Minikube)

**Objetivo:** orquestrar os containers da aplicação usando Kubernetes com Minikube, 
garantindo que os serviços sejam gerenciados, escalados e reiniciados automaticamente.

**O que é Kubernetes?**
Kubernetes (K8s) é uma plataforma de orquestração de containers. Enquanto o Docker 
Compose sobe containers em uma única máquina, o Kubernetes gerencia containers em 
múltiplas máquinas, cuida de reinicialização automática em caso de falha, balanceamento 
de carga, escalabilidade e muito mais.

**O que é Minikube?**
Minikube é uma versão local do Kubernetes que roda em uma única máquina. É ideal para 
desenvolvimento e aprendizado, pois simula um cluster completo sem precisar de 
infraestrutura em nuvem.

**Diferença entre Docker Compose e Kubernetes:**

| | Docker Compose | Kubernetes |
|--|---------------|------------|
| **Uso** | Desenvolvimento local | Produção e escala |
| **Reinício automático** | Limitado | Nativo e robusto |
| **Escalabilidade** | Manual | Automática |
| **Balanceamento de carga** | Não tem | Nativo |
| **Múltiplas máquinas** | Não | Sim |

**O que foi criado:**

`k8s/namespace.yml` — cria o namespace `mkjs` para isolar os recursos do projeto 
dentro do cluster.

`k8s/db-deployment.yml` — define o Deployment e Service do banco de dados Postgres:
- 1 réplica do container Postgres
- Variáveis de ambiente para configuração do banco
- `readinessProbe` para garantir que o banco está pronto antes de aceitar conexões
- Service interno para comunicação entre os pods

`k8s/backend-deployment.yml` — define o Deployment e Service do servidor Node.js:
- 1 réplica do backend
- Variáveis de ambiente apontando para o serviço do banco
- NodePort `30555` para acesso externo ao cluster

`k8s/frontend-deployment.yml` — define o Deployment e Service do Nginx:
- 1 réplica do frontend
- NodePort `30080` para acesso externo ao cluster

**Conceitos importantes:**

| Conceito | O que é |
|----------|---------|
| **Pod** | Menor unidade do Kubernetes, contém um ou mais containers |
| **Deployment** | Define quantas réplicas de um Pod devem rodar e como atualizá-las |
| **Service** | Expõe um Deployment para ser acessado por outros pods ou externamente |
| **NodePort** | Tipo de Service que expõe a aplicação em uma porta do cluster |
| **Namespace** | Espaço isolado dentro do cluster para organizar recursos |

**Como rodar:**

```bash
# Iniciar o Minikube
minikube start --driver=docker

# Apontar Docker para o Minikube e buildar imagens
eval $(minikube docker-env)
docker build -t trabalho-final-gces-ana-pereira-app:latest .
docker build -f Dockerfile.prod --target frontend \
  -t trabalho-final-gces-ana-pereira-frontend:latest .

# Aplicar os manifests

### ✅ Fase 9 — Orquestração com Kubernetes (Minikube)

**Objetivo:** orquestrar os containers da aplicação usando Kubernetes com Minikube, 
garantindo que os serviços sejam gerenciados, escalados e reiniciados automaticamente.

**O que é Kubernetes?**
Kubernetes (K8s) é uma plataforma de orquestração de containers. Enquanto o Docker 
Compose sobe containers em uma única máquina, o Kubernetes gerencia containers em 
múltiplas máquinas, cuida de reinicialização automática em caso de falha, balanceamento 
de carga, escalabilidade e muito mais.

**O que é Minikube?**
Minikube é uma versão local do Kubernetes que roda em uma única máquina. É ideal para 
desenvolvimento e aprendizado, pois simula um cluster completo sem precisar de 
infraestrutura em nuvem.

**Diferença entre Docker Compose e Kubernetes:**

| | Docker Compose | Kubernetes |
|--|---------------|------------|
| **Uso** | Desenvolvimento local | Produção e escala |
| **Reinício automático** | Limitado | Nativo e robusto |
| **Escalabilidade** | Manual | Automática |
| **Balanceamento de carga** | Não tem | Nativo |
| **Múltiplas máquinas** | Não | Sim |

**O que foi criado:**

`k8s/namespace.yml` — cria o namespace `mkjs` para isolar os recursos do projeto 
dentro do cluster.

`k8s/db-deployment.yml` — define o Deployment e Service do banco de dados Postgres:
- 1 réplica do container Postgres
- Variáveis de ambiente para configuração do banco
- `readinessProbe` para garantir que o banco está pronto antes de aceitar conexões
- Service interno para comunicação entre os pods

`k8s/backend-deployment.yml` — define o Deployment e Service do servidor Node.js:
- 1 réplica do backend
- Variáveis de ambiente apontando para o serviço do banco
- NodePort `30555` para acesso externo ao cluster

`k8s/frontend-deployment.yml` — define o Deployment e Service do Nginx:
- 1 réplica do frontend
- NodePort `30080` para acesso externo ao cluster

**Conceitos importantes:**

| Conceito | O que é |
|----------|---------|
| **Pod** | Menor unidade do Kubernetes, contém um ou mais containers |
| **Deployment** | Define quantas réplicas de um Pod devem rodar e como atualizá-las |
| **Service** | Expõe um Deployment para ser acessado por outros pods ou externamente |
| **NodePort** | Tipo de Service que expõe a aplicação em uma porta do cluster |
| **Namespace** | Espaço isolado dentro do cluster para organizar recursos |

**Como rodar:**

```bash
# Iniciar o Minikube
minikube start --driver=docker

# Apontar Docker para o Minikube e buildar imagens
eval $(minikube docker-env)
docker build -t trabalho-final-gces-ana-pereira-app:latest .
docker build -f Dockerfile.prod --target frontend \
  -t trabalho-final-gces-ana-pereira-frontend:latest .

# Aplicar os manifests
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/db-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml

# Verificar status
kubectl get all -n mkjs

# Obter URLs de acesso
minikube service frontend -n mkjs --url
minikube service backend -n mkjs --url
```

**Pipeline completo após Fase 9:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
├── ✅ SonarCloud - Qualidade de Código
└── ✅ Build de Produção
```

**Resultado:**
- Cluster Kubernetes local rodando com Minikube
- 3 serviços orquestrados: banco de dados, backend e frontend
- Pods reiniciados automaticamente em caso de falha
- Aplicação acessível via NodePort

![Pods Kubernetes rodando](img/fase9-k8s-pods.png)
![Frontend acessível via Minikube](img/fase9-frontend.png)

**Commit no GitHub:** 
`feat: adiciona manifests Kubernetes para orquestracao com Minikube`

### ✅ Fase 10 — Deploy Contínuo com HTTPS

**Objetivo:** configurar um pipeline de CD (Continuous Deployment) que publique 
automaticamente as imagens Docker no GitHub Container Registry e faça deploy do 
frontend com HTTPS via GitHub Pages a cada push na branch `main`.

**O que é CD?**
CD (Continuous Deployment) é a prática de publicar automaticamente uma nova versão 
da aplicação sempre que o código é aprovado no CI. Elimina a necessidade de deploy 
manual e garante que o ambiente de produção sempre reflita o código mais recente da 
branch principal.

**O que é HTTPS?**
HTTPS é a versão segura do HTTP, onde toda a comunicação entre o navegador e o 
servidor é criptografada via SSL/TLS. É obrigatório para qualquer aplicação em 
produção e é exigido pelo navegador para funcionalidades como webcam e geolocalização.

**Diferença entre CI e CD:**

| CI | CD |
|----|----|
| Verifica se o código está correto | Publica o código automaticamente |
| Roda testes, lint e análises | Faz deploy em produção |
| Termina com um relatório | Termina com uma nova versão publicada |

**O que foi criado:**

`.github/workflows/cd.yml` — workflow de CD com dois jobs:

**Job `publish-docker`:**
- Faz login no GitHub Container Registry (GHCR) usando o `GHCR_TOKEN`
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/db-deployment.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml

# Verificar status
kubectl get all -n mkjs

# Obter URLs de acesso
minikube service frontend -n mkjs --url
minikube service backend -n mkjs --url
```

**Pipeline completo após Fase 9:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
├── ✅ SonarCloud - Qualidade de Código
└── ✅ Build de Produção
```

**Resultado:**
- Cluster Kubernetes local rodando com Minikube
- 3 serviços orquestrados: banco de dados, backend e frontend
- Pods reiniciados automaticamente em caso de falha
- Aplicação acessível via NodePort

![Pods Kubernetes rodando](img/fase9-k8s-pods.png)
![Frontend acessível via Minikube](img/fase9-frontend.png)

**Commit no GitHub:** 
`feat: adiciona manifests Kubernetes para orquestracao com Minikube`

### ✅ Fase 10 — Deploy Contínuo com HTTPS

**Objetivo:** configurar um pipeline de CD (Continuous Deployment) que publique 
automaticamente as imagens Docker no GitHub Container Registry e faça deploy do 
frontend com HTTPS via GitHub Pages a cada push na branch `main`.

**O que é CD?**
CD (Continuous Deployment) é a prática de publicar automaticamente uma nova versão 
da aplicação sempre que o código é aprovado no CI. Elimina a necessidade de deploy 
manual e garante que o ambiente de produção sempre reflita o código mais recente da 
branch principal.

**O que é HTTPS?**
HTTPS é a versão segura do HTTP, onde toda a comunicação entre o navegador e o 
servidor é criptografada via SSL/TLS. É obrigatório para qualquer aplicação em 
produção e é exigido pelo navegador para funcionalidades como webcam e geolocalização.

**Diferença entre CI e CD:**

| CI | CD |
|----|----|
| Verifica se o código está correto | Publica o código automaticamente |
| Roda testes, lint e análises | Faz deploy em produção |
| Termina com um relatório | Termina com uma nova versão publicada |

**O que foi criado:**

`.github/workflows/cd.yml` — workflow de CD com dois jobs:

**Job `publish-docker`:**
- Faz login no GitHub Container Registry (GHCR) usando o `GHCR_TOKEN`
- Builda as imagens de backend e frontend usando o `Dockerfile.prod`
- Publica as imagens com duas tags: `latest` e o hash do commit (`sha`)
- As imagens ficam disponíveis publicamente para download via `docker pull`

**Job `deploy-pages`:**
- Roda após o `publish-docker`
- Copia os arquivos do frontend (`game/`) para o GitHub Pages
- Publica automaticamente com HTTPS nativo do GitHub
- A URL final é `https://analeticiaa.github.io/Trabalho-Final-GCES-Ana-Leticia`

`deploy-info.md` — documentação das URLs das imagens publicadas e como usá-las.

**Por que GitHub Pages para HTTPS?**
O GitHub Pages oferece HTTPS automático e gratuito via certificado SSL gerenciado 
pelo GitHub. É ideal para hospedar o frontend estático da aplicação sem precisar 
configurar um servidor ou comprar um certificado SSL.

**Imagens publicadas no GHCR:**

```bash
# Backend
docker pull ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/backend:latest

# Frontend  
docker pull ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/frontend:latest
```

**Pipeline completo final:**

```
CI - Build, Lint, Testes, Fuzzing, Segurança e Qualidade
├── ✅ Lint do Backend
├── ✅ Build do Frontend
├── ✅ Testes Unitários
├── ✅ Fuzzing do Backend
├── ✅ SAST - Semgrep
├── ✅ SCA - Auditoria de Dependências
├── ✅ SonarCloud - Qualidade de Código
└── ✅ Build de Produção

CD - Deploy Contínuo
├── ✅ Publicar imagem no GHCR
└── ✅ Deploy Frontend via GitHub Pages (HTTPS)
```

**URLs de produção:**
- 🌐 Frontend HTTPS: `https://analeticiaa.github.io/Trabalho-Final-GCES-Ana-Leticia`
- 📦 Imagens Docker: `ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia`

**Resultado:**
- Imagens Docker publicadas automaticamente no GHCR a cada push
- Frontend disponível publicamente via HTTPS sem configuração manual
- Pipeline completo de CI/CD funcionando de ponta a ponta

![Pipeline CD passando](img/fase10-pipeline.png)
![Link pages](img/pages.png)
![Frontend com HTTPS via GitHub Pages](img/fase10-https.png)
![Imagens publicadas no GHCR](img/fase10-ghcr.png)

**Commit no GitHub:** 
`feat: adiciona CD com publicacao no GHCR e deploy HTTPS via GitHub Pages`

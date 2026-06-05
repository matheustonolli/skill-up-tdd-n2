# skill-up-tdd

**Disciplina:** Testes de Software 

**Fase:** 3 

**Integrante:** Matheus Tonolli Cordeiro

---

## Sumário

- [Objetivo do Projeto](#objetivo-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Conceito de TDD](#conceito-de-tdd)
- [Desenvolvimento com TDD](#desenvolvimento-com-tdd)
- [Testes Unitários](#testes-unitários)
- [Testes de Integração](#testes-de-integração)
- [Cobertura de Testes](#cobertura-de-testes)
- [Refatorações Realizadas](#refatorações-realizadas)
- [Resultados Obtidos](#resultados-obtidos)
- [Como Executar](#como-executar)
- [Conclusão](#conclusão)

---

## Objetivo do Projeto

Este projeto foi desenvolvido como avaliação prática da disciplina de Testes de Software, com o objetivo de aplicar a metodologia **Test-Driven Development (TDD)** no desenvolvimento de uma funcionalidade de gerenciamento de usuários em Node.js.

O trabalho demonstra na prática:

- A aplicação do ciclo **Red-Green-Refactor** a cada nova funcionalidade;
- A escrita de testes antes da implementação do código de produção;
- A validação da lógica de negócio na camada Service por meio de testes unitários;
- A validação do comportamento HTTP na camada Controller por meio de testes de integração;
- A realização de refatorações seguras sustentadas pela suíte de testes;
- A obtenção de cobertura de testes superior à meta mínima estabelecida.

---

## Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
|---|---|
| **Node.js** | Plataforma de execução JavaScript no servidor |
| **Express** | Framework web para construção da API REST |
| **Sequelize** | ORM para mapeamento objeto-relacional da camada Model |
| **Vitest** | Framework de testes unitários e de integração |
| **Supertest** | Biblioteca para simulação de requisições HTTP nos testes |

> **Observação:** O Sequelize é utilizado pela camada Model para definição do esquema da entidade `User`. Os testes implementados não utilizam banco de dados real — as dependências de persistência são substituídas por mocks durante a execução dos testes.

---

## Estrutura do Projeto

```
skill-up-tdd/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   └── modules/
│       ├── health/
│       │   ├── health.service.js
│       │   └── __tests__/
│       │       └── health.service.test.js
│       └── user/
│           ├── user.model.js
│           ├── user.service.js
│           ├── user.controller.js
│           └── __tests__/
│               ├── user.service.test.js
│               └── user.controller.test.js
├── test/
│   └── setup.js
├── vitest.config.js
└── package.json
```

### Módulo Health

| Arquivo | Responsabilidade |
|---|---|
| `health.service.js` | Retorna informações sobre o estado de saúde da aplicação |
| `health.service.test.js` | 1 teste unitário que verifica o retorno correto do status |

### Módulo User

| Arquivo | Responsabilidade |
|---|---|
| `user.model.js` | Define a entidade `User` com seus atributos via Sequelize |
| `user.service.js` | Contém toda a lógica de negócio: validações, regras e operações CRUD |
| `user.controller.js` | Recebe as requisições HTTP, delega ao Service e retorna as respostas |
| `user.service.test.js` | 15 testes unitários da camada Service |
| `user.controller.test.js` | 6 testes de integração da camada Controller |

#### Model

Representa a entidade `User` por meio do Sequelize, definindo os campos `id`, `username`, `email`, `password`, `fullName`, `bio` e `profilePicture`, com suas respectivas restrições de nulidade e unicidade.

#### Service

Camada responsável por toda a lógica de negócio da aplicação. Implementa as operações `createUser`, `findUserById`, `updateUser` e `deleteUser`, realizando validações de entrada e aplicando as regras de domínio antes de interagir com a camada de persistência. Utiliza **injeção de dependência** — recebe o Model como parâmetro — o que viabiliza o isolamento completo nos testes unitários.

#### Controller

Camada responsável por traduzir requisições HTTP em chamadas ao Service e transformar os resultados em respostas HTTP adequadas, com os status codes corretos. Implementa os handlers `create`, `findAll`, `findById`, `update` e `delete`.

---

## Conceito de TDD

Test-Driven Development (TDD) é uma metodologia de desenvolvimento de software fundamentada na escrita de testes automatizados antes da implementação do código de produção. O processo é estruturado em um ciclo de três fases que se repetem de forma contínua ao longo do desenvolvimento.

### 🔴 Red

O ciclo tem início com a escrita de um teste que descreve o comportamento esperado de uma funcionalidade ainda inexistente. Ao ser executado, esse teste **falha** — o que é o resultado esperado e necessário nesta fase. A falha confirma que o teste está verificando algo real e que não há implementação trivial passando inadvertidamente. Esta etapa obriga o desenvolvedor a definir com precisão o comportamento desejado antes de qualquer decisão de implementação, promovendo um design mais intencional e orientado a requisitos.

### 🟢 Green

Com o teste falhando, o desenvolvedor implementa o **código mínimo e suficiente** para que ele passe. O foco exclusivo é satisfazer o teste — sem otimizações, sem generalizações prematuras. Ao final desta fase, todos os testes da suíte devem estar passando.

### 🔵 Refactor

Com os testes verdes, o código é **melhorado e reorganizado** com foco em legibilidade, eliminação de duplicações e aplicação de boas práticas de design. A suíte de testes existente atua como rede de segurança: qualquer regressão introduzida durante a refatoração é detectada imediatamente. Ao final, todos os testes continuam passando com o mesmo comportamento de antes.

Todo o módulo User foi desenvolvido seguindo rigorosamente esse ciclo, ciclo a ciclo, funcionalidade a funcionalidade.

---

## Desenvolvimento com TDD

O módulo User foi construído em **10 ciclos TDD** sequenciais. Os cinco primeiros ciclos cobriram a camada Service; os cinco seguintes, a camada Controller.

| Ciclo | Fase | Funcionalidade | Testes acumulados |
|---|---|---|---|
| 1 | RED → GREEN | `createUser`: caminho de sucesso | 1 ✅ |
| 2 | RED → GREEN → **REFACTOR** | `createUser`: validações de entrada | 5 ✅ |
| 3 | RED → GREEN | `findUserById` | 8 ✅ |
| 4 | RED → GREEN | `updateUser` | 12 ✅ |
| 5 | RED → GREEN → **REFACTOR** | `deleteUser` | 15 ✅ |
| 6 | RED | `POST /users` — controller ausente | falha esperada |
| 7 | RED | `GET /users` — controller ausente | falha esperada |
| 8 | RED | `GET /users/:id` — controller ausente | falha esperada |
| 9 | RED | `PUT /users/:id` — controller ausente | falha esperada |
| 10 | RED → GREEN → **REFACTOR** | Todos os endpoints do Controller | **21 ✅** |

> Nos ciclos 6 a 9, os testes de integração foram escritos antes do arquivo `user.controller.js` existir. A execução resultava em `Error: Failed to load url ../user.controller.js` — estado Red confirmado. O controller só foi implementado no ciclo 10.

---

## Testes Unitários

**Total: 16 testes unitários**

Os testes unitários isolam completamente a lógica de negócio de qualquer dependência externa. O `UserModel` do Sequelize é substituído por um mock construído com `vi.fn()`, garantindo que nenhum teste acesse banco de dados, rede ou sistema de arquivos.

```js
function makeMockUserModel() {
  return {
    findOne:  vi.fn(),
    findByPk: vi.fn(),
    create:   vi.fn(),
  };
}
```

O Service é instanciado com esse mock via injeção de dependência:

```js
const userService = createUserService(UserModel);
```

### Health Service — 1 teste

| # | Cenário |
|---|---|
| 1 | Retorna objeto com `status: 'OK'` e propriedade `timestamp` |

### User Service — 15 testes

#### `createUser` — 5 testes

| # | Cenário |
|---|---|
| 1 | Cria usuário com dados válidos e retorna o objeto criado |
| 2 | Lança erro quando `username` está ausente ou vazio |
| 3 | Lança erro quando `email` está ausente ou vazio |
| 4 | Lança erro quando o formato do `email` é inválido |
| 5 | Lança erro quando o `email` já está cadastrado |

#### `findUserById` — 3 testes

| # | Cenário |
|---|---|
| 6 | Retorna o usuário correto quando o ID existe |
| 7 | Lança erro quando o usuário não é encontrado |
| 8 | Valida que o objeto retornado possui as propriedades `id`, `username` e `email` |

#### `updateUser` — 4 testes

| # | Cenário |
|---|---|
| 9 | Atualiza os dados de um usuário existente com sucesso |
| 10 | Lança erro ao tentar atualizar um usuário inexistente |
| 11 | Lança erro ao tentar atualizar com um email de formato inválido |
| 12 | Lança erro ao tentar atualizar para um email já utilizado por outro usuário |

#### `deleteUser` — 3 testes

| # | Cenário |
|---|---|
| 13 | Remove um usuário existente com sucesso |
| 14 | Lança erro ao tentar remover um usuário inexistente |
| 15 | Verifica que `findByPk` é chamado com o ID correto antes da remoção |

---

## Testes de Integração

**Total: 6 testes de integração**

Os testes de integração validam o comportamento da camada Controller em conjunto com o roteamento Express, verificando o fluxo completo:

```
Requisição HTTP → Express Router → Controller → Service (mockado)
```

Não são testes End-to-End: o `UserService` é substituído por um objeto com métodos `vi.fn()`, o que isola o Controller de qualquer acesso a banco de dados. O objetivo é validar exclusivamente o comportamento HTTP do Controller — status codes, estrutura do corpo da resposta e delegação correta ao Service.

Para cada teste é construída uma instância Express isolada:

```js
function buildTestApp(userService) {
  const app = express();
  app.use(express.json());
  const userController = createUserController(userService);

  return app;
}
```

### Cenários testados

| # | Método | Endpoint | Cenário | Status esperado |
|---|---|---|---|---|
| 1 | `POST` | `/users` | Criação de usuário com dados válidos | `201 Created` |
| 2 | `GET` | `/users` | Listagem de todos os usuários | `200 OK` |
| 3 | `GET` | `/users/:id` | Busca por usuário existente | `200 OK` |
| 4 | `GET` | `/users/:id` | Busca por usuário inexistente | `404 Not Found` |
| 5 | `PUT` | `/users/:id` | Atualização de dados do usuário | `200 OK` |
| 6 | `DELETE` | `/users/:id` | Remoção de usuário | `204 No Content` |

Cada teste verifica:

- o **status HTTP** retornado pelo Controller;
- a **estrutura e os dados do corpo** da resposta quando aplicável;
- que o **método correto do Service** foi chamado com os parâmetros esperados.

Os Services são mockados conforme orientação do professor, seguindo o padrão adotado no projeto didático Shortz-App-TDD.

---

## Cobertura de Testes

A cobertura foi gerada com o comando:

```bash
npm run test:coverage

```

### Resultados obtidos

| Métrica | Resultado | Meta mínima | Status |
|---|---|---|---|
| **Statements** | 94,44% | 80% | ✅ Superada |
| **Branches** | 91,66% | 80% | ✅ Superada |
| **Functions** | 100% | 80% | ✅ Superada |
| **Lines** | 94,44% | 80% | ✅ Superada |

### Significado de cada métrica

- **Statements (instruções):** percentual de instruções individuais do código que foram executadas durante os testes. Uma instrução pode ser uma atribuição, uma chamada de função ou qualquer expressão avaliada.

- **Branches (desvios condicionais):** percentual de ramificações de estruturas condicionais (`if/else`, operadores ternários, `switch`) que foram exercitadas. Uma cobertura alta de branches indica que os testes cobrem tanto os caminhos de sucesso quanto os de falha.

- **Functions (funções):** percentual de funções declaradas no código que foram chamadas ao menos uma vez durante a execução dos testes.

- **Lines (linhas):** percentual de linhas de código-fonte efetivamente executadas. Linhas de declaração, comentários e linhas em branco são excluídas do cálculo.

Todas as quatro métricas superaram a meta mínima de 80% estabelecida pelo professor, confirmando que a suíte de testes cobre adequadamente o comportamento do código de produção implementado.

---

## Refatorações Realizadas

As refatorações foram realizadas na fase **Refactor** dos ciclos TDD, após os testes estarem verdes. Em nenhum momento os testes foram alterados para acomodar as mudanças — a suíte permaneceu completamente verde antes, durante e após cada refatoração.

### User Service — extração de `assertUserExists`

**Antes:** as funções `findUserById`, `updateUser` e `deleteUser` repetiam o mesmo bloco de código para buscar um usuário e lançar erro caso não fosse encontrado:

```js

const user = await UserModel.findByPk(id);
if (!user) throw new Error('Usuário não encontrado.');
return user;
```

**Depois:** o padrão foi extraído para uma função interna `assertUserExists(id)`, reutilizada pelas três operações:

```js
async function assertUserExists(id) {
  const user = await UserModel.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado.');
  return user;
}
```

**Benefício:** eliminação de duplicação de código, centralização da mensagem de erro e redução do esforço de manutenção — qualquer alteração nessa lógica passa a ser feita em um único lugar.

### User Service — extração de `isValidEmail`

**Antes:** a expressão regular de validação de email estava embutida diretamente na estrutura condicional de `createUser`:

```js
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
  throw new Error('Email inválido.');
```

**Depois:** a lógica foi extraída para a função `isValidEmail(email)`, reutilizada tanto em `createUser` quanto em `updateUser`:

```js
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}
```

**Benefício:** legibilidade aprimorada, reutilização sem duplicação e facilidade para substituir ou evoluir a lógica de validação em um único ponto.

### User Controller — extração de `sendError`

**Antes:** o padrão de resposta de erro estava repetido em todos os handlers do Controller:

```js

res.status(400).json({ error: err.message });
```

**Depois:** centralizado na função auxiliar `sendError`:

```js
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}
```

**Benefício:** uniformidade na estrutura das respostas de erro, eliminação de repetição e simplificação de cada handler, tornando o fluxo principal de cada função mais evidente.

---

## Resultados Obtidos

Ao final do desenvolvimento, o projeto apresenta os seguintes resultados:

- **21 testes** executam com sucesso: 16 unitários e 6 de integração — todos passando;
- **Cobertura acima da meta** em todas as quatro métricas (Statements, Branches, Functions e Lines);
- **Ciclo TDD aplicado integralmente** em todos os ciclos de desenvolvimento, com evidência das fases Red, Green e Refactor;
- **Separação clara de responsabilidades** entre Model, Service e Controller, o que viabilizou o teste isolado de cada camada sem dependências reais;
- **Refatorações seguras** realizadas com suporte da suíte de testes, sem qualquer regressão introduzida.

---

## Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

```bash
npm install
```

### Executar os testes

```bash
# Executar todos os testes uma vez
npm run test:run

# Executar em modo watch (desenvolvimento)
npm test

# Gerar relatório de cobertura
npm run test:coverage
```

---

## Conclusão

O desenvolvimento do módulo User com a metodologia Test-Driven Development demonstrou, na prática, como a inversão da ordem tradicional de escrita de código — testes antes da implementação — impacta positivamente a qualidade, a confiabilidade e a manutenibilidade do software produzido.

A disciplina de escrever o teste antes da funcionalidade obrigou a definição precisa do comportamento esperado de cada operação antes de qualquer decisão de implementação. Isso resultou em um código de produção mais enxuto, direto e orientado a requisitos verificáveis, sem implementações antecipadas ou funcionalidades não testadas.

A fase de refatoração evidenciou um dos benefícios centrais do TDD: a presença de uma suíte de testes confiável transforma mudanças estruturais no código em operações seguras. As extrações de `assertUserExists`, `isValidEmail` e `sendError` foram realizadas com total confiança de que qualquer regressão seria detectada imediatamente — e nenhuma foi introduzida.

A cobertura final — 90,74% de statements, 88,57% de branches, 93,33% de functions e 90,74% de lines — superou a meta mínima de 80% em todas as métricas, confirmando que a suíte de testes exercita adequadamente o comportamento do código implementado.

A separação entre as camadas Service e Controller, viabilizada pelo uso de injeção de dependência e mocks, demonstrou como um design orientado à testabilidade facilita não apenas a escrita dos testes, mas também a localização de falhas, a evolução incremental do sistema e a compreensão do código por outros desenvolvedores.

Conclui-se que o TDD não é apenas uma prática de verificação, mas uma disciplina de design que, ao alinhar especificação, implementação e validação em um único ciclo contínuo, contribui diretamente para a construção de software de maior qualidade.
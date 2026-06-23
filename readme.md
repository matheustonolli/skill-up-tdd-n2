# SkillUp-TDD

**Disciplina:** Testes de Software

**Fase:** 3

**Avaliação:** N3 – Evolução do Projeto com TDD

**Integrante:** Matheus Tonolli Cordeiro

---

# Sumário

- [Objetivo do Projeto](#objetivo-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Nova Funcionalidade Implementada](#nova-funcionalidade-implementada)
- [Conceito de TDD](#conceito-de-tdd)
- [Aplicação do TDD no Projeto](#aplicação-do-tdd-no-projeto)
- [Testes Unitários](#testes-unitários)
- [Testes de Integração](#testes-de-integração)
- [Resultados Obtidos](#resultados-obtidos)
- [Como Executar](#como-executar)
- [Conclusão](#conclusão)

---

# Objetivo do Projeto

Este projeto foi desenvolvido como continuação da avaliação N2 da disciplina de Testes de Software, utilizando a metodologia **Test-Driven Development (TDD)**.

Na etapa anterior do projeto foi implementada a funcionalidade de gerenciamento de usuários. Para a N3, o sistema foi evoluído com a implementação de uma nova funcionalidade denominada **Lesson (Lição)**, seguindo o mesmo padrão arquitetural já existente na aplicação.

O objetivo principal foi aplicar na prática os conceitos de desenvolvimento guiado por testes, criando uma nova funcionalidade completa utilizando as camadas Model, Service, Controller e Routes, acompanhadas por testes unitários e de integração.

O trabalho demonstra:

- Aplicação do ciclo Red-Green-Refactor;
- Desenvolvimento guiado por testes (TDD);
- Implementação de uma nova funcionalidade seguindo arquitetura modular;
- Criação de testes unitários e testes de integração;
- Utilização de mocks para isolamento de dependências;
- Validação de regras de negócio;
- Evolução segura do software através da suíte de testes automatizados.

---

# Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
|------------|-------------------|
| Node.js | Ambiente de execução JavaScript |
| Express | Framework para construção da API |
| Sequelize | ORM utilizado na camada Model |
| Vitest | Framework de testes unitários |
| Supertest | Testes de integração HTTP |
| bcryptjs | Criptografia de senhas |
| MySQL / mysql2 | Persistência de dados |
| dotenv | Variáveis de ambiente |
| express-session | Controle de sessões |
| connect-flash | Mensagens temporárias |
| multer | Upload de arquivos |
| morgan | Logs de requisições |

---

# Estrutura do Projeto

```text
skill-up-tdd/
├── src/
│
├── app.js
├── server.js
│
├── config/
│   └── database.js
│
└── modules/
│
├── health/
│   ├── health.service.js
│   └── __tests__/
│       └── health.service.test.js
│
├── user/
│   ├── user.model.js
│   ├── user.service.js
│   ├── user.controller.js
│   ├── user.routes.js
│   └── __tests__/
│       ├── user.service.test.js
│       └── user.controller.test.js
│
└── lesson/
    ├── lesson.model.js
    ├── lesson.service.js
    ├── lesson.controller.js
    ├── lesson.routes.js
    └── __tests__/
        ├── lesson.service.test.js
        └── lesson.controller.test.js

test/
└── setup.js

vitest.config.js
package.json
```

A arquitetura foi organizada em módulos independentes, facilitando manutenção, escalabilidade e testes.

---

# Nova Funcionalidade Implementada

## Lesson (Lição)

A funcionalidade Lesson foi criada para permitir o gerenciamento de lições dentro da aplicação.

Cada lição possui:

| Campo | Descrição |
|---------|------------|
| id | Identificador da lição |
| title | Título da lição |
| description | Descrição da lição |
| completed | Status de conclusão |
| createdAt | Data de criação |
| updatedAt | Data de atualização |

## Operações Disponíveis

- Criar lição
- Listar lições
- Buscar lição por ID
- Atualizar lição
- Excluir lição
- Marcar lição como concluída

## Rotas Disponíveis

| Método | Rota | Função |
|----------|--------|---------|
| POST | /lessons | Criar lição |
| GET | /lessons | Listar lições |
| GET | /lessons/:id | Buscar por ID |
| PUT | /lessons/:id | Atualizar lição |
| DELETE | /lessons/:id | Excluir lição |
| PATCH | /lessons/:id/complete | Marcar como concluída |

## Regras de Negócio

- O título é obrigatório.
- A descrição é obrigatória.
- Toda lição inicia com completed = false.
- Não é possível buscar uma lição inexistente.
- Não é possível atualizar uma lição inexistente.
- Não é possível excluir uma lição inexistente.
- Não é possível marcar como concluída uma lição inexistente.

---

# Conceito de TDD

Test-Driven Development (TDD) é uma metodologia de desenvolvimento baseada na criação de testes antes da implementação do código.

O processo é dividido em três etapas:

## Red

Criar um teste que inicialmente falha.

## Green

Implementar o código mínimo necessário para fazer o teste passar.

## Refactor

Melhorar a estrutura do código mantendo todos os testes aprovados.

Esse ciclo foi repetido durante toda a implementação da funcionalidade Lesson.

---

# Aplicação do TDD no Projeto

## Red

Inicialmente foi criado um teste verificando que uma lição não poderia ser criada sem título.

Exemplo:

```javascript
it('deve falhar ao criar lição sem título', async () => {
  await expect(
    lessonService.createLesson({
      title: '',
      description: 'Descrição'
    })
  ).rejects.toThrow('Título é obrigatório.');
});
```

Nesse momento o teste falhava porque a validação ainda não existia.

---

## Green

Foi implementada a validação mínima no Service:

```javascript
if (!data.title || data.title.trim() === '') {
  throw new Error('Título é obrigatório.');
}
```

Após a implementação o teste passou.

---

## Refactor

Foi criada uma função auxiliar para evitar duplicação de código na verificação da existência de uma lição:

```javascript
async function assertLessonExists(id) {
  const lesson = await LessonModel.findByPk(id);

  if (!lesson) {
    throw new Error('Lição não encontrada.');
  }

  return lesson;
}
```

Essa melhoria reduziu repetição e manteve todos os testes aprovados.

---

# Testes Unitários

Foram implementados **11 testes unitários** para a camada Service da funcionalidade Lesson.

Os testes utilizam mocks do Sequelize para isolar a lógica de negócio.

## Exemplo 1 — Criação de Lição

Objetivo:

Verificar se uma lição é criada corretamente quando os dados são válidos.

Assertions utilizadas:

```javascript
expect(result).toEqual(mockCreated);
expect(LessonModel.create).toHaveBeenCalledOnce();
```

---

## Exemplo 2 — Validação de Descrição Obrigatória

Objetivo:

Garantir que uma lição sem descrição não seja criada.

Assertions utilizadas:

```javascript
expect(...).rejects.toThrow('Descrição é obrigatória.');
expect(LessonModel.create).not.toHaveBeenCalled();
```

---

## Exemplo 3 — Marcar Lição como Concluída

Objetivo:

Garantir que o status completed seja alterado para true.

Assertions utilizadas:

```javascript
expect(mockLesson.update)
  .toHaveBeenCalledWith({ completed: true });

expect(result).toBe(mockLesson);
```

---

# Testes de Integração

Foram implementados **10 testes de integração** utilizando Supertest.

Esses testes validam o comportamento HTTP da aplicação.

## Exemplo 1 — POST /lessons

Objetivo:

Criar uma nova lição.

Validações realizadas:

```javascript
expect(res.status).toBe(201);
expect(res.body.title).toBe('TDD');
```

Resultado esperado:

A API retorna status 201 e os dados da lição criada.

---

## Exemplo 2 — GET /lessons/:id

Objetivo:

Garantir que a API retorne erro quando a lição não existir.

Validações realizadas:

```javascript
expect(res.status).toBe(404);

expect(res.body.error)
  .toBe('Lição não encontrada.');
```

Resultado esperado:

A API retorna status HTTP 404.

---

# Resultados Obtidos

Durante a implementação da N3 foram alcançados os seguintes resultados:

- Nova funcionalidade Lesson implementada com sucesso;
- Estrutura modular utilizando Model, Service, Controller e Routes;
- 11 testes unitários implementados;
- 10 testes de integração implementados;
- Cobertura das principais regras de negócio;
- Aplicação prática da metodologia TDD;
- Evolução segura do projeto através dos testes automatizados.

---

# Como Executar

## Instalação das Dependências

```bash
npm install
```

## Executar o Projeto

```bash
npm start
```

ou

```bash
npm run dev
```

## Executar os Testes

```bash
npm test
```

Todos os testes devem ser executados com sucesso.

---

# Conclusão

A evolução do projeto SkillUp-TDD permitiu aplicar na prática os conceitos estudados durante a disciplina de Testes de Software.

A implementação da funcionalidade Lesson seguiu rigorosamente a metodologia TDD, utilizando o ciclo Red-Green-Refactor para garantir qualidade e segurança durante o desenvolvimento.

Os testes unitários validaram as regras de negócio da camada Service, enquanto os testes de integração verificaram o comportamento das rotas e respostas HTTP da aplicação.

Com a adição da nova funcionalidade e da nova suíte de testes, o projeto tornou-se mais robusto, organizado e alinhado às boas práticas de desenvolvimento de software, atendendo aos requisitos propostos para a avaliação N3.
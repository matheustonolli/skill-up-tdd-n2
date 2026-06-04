import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createUserController } from '../user.controller.js';

function makeMockUserService() {
  return {
    createUser:   vi.fn(),
    findAll:      vi.fn(),
    findUserById: vi.fn(),
    updateUser:   vi.fn(),
    deleteUser:   vi.fn(),
  };
}

function buildTestApp(userService) {
  const app = express();
  app.use(express.json());

  const userController = createUserController(userService);

  const router = express.Router();
  router.post('/',      userController.create);
  router.get('/',       userController.findAll);
  router.get('/:id',    userController.findById);
  router.put('/:id',    userController.update);
  router.delete('/:id', userController.delete);

  app.use('/users', router);
  return app;
}

describe('POST /users', () => {
  let userService;
  let app;

  beforeEach(() => {
    userService = makeMockUserService();
    app = buildTestApp(userService);
  });

  it('deve criar usuário e retornar status 201 com os dados do usuário criado', async () => {
    const payload  = { username: 'joaosilva', email: 'joao@exemplo.com', password: 'senha123' };
    const mockUser = { id: 1, ...payload };
    userService.createUser.mockResolvedValue(mockUser);

    const res = await request(app).post('/users').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body.username).toBe('joaosilva');
    expect(userService.createUser).toHaveBeenCalledWith(payload);
  });
});

describe('GET /users', () => {
  let userService;
  let app;

  beforeEach(() => {
    userService = makeMockUserService();
    app = buildTestApp(userService);
  });

  it('deve retornar status 200 e um array de usuários', async () => {
    const mockList = [
      { id: 1, username: 'user1', email: 'u1@ex.com' },
      { id: 2, username: 'user2', email: 'u2@ex.com' },
    ];
    userService.findAll.mockResolvedValue(mockList);

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(userService.findAll).toHaveBeenCalledOnce();
  });
});

describe('GET /users/:id', () => {
  let userService;
  let app;

  beforeEach(() => {
    userService = makeMockUserService();
    app = buildTestApp(userService);
  });

  it('deve retornar status 200 e o usuário correto quando encontrado', async () => {
    const mockUser = { id: 1, username: 'mariasilva', email: 'maria@ex.com' };
    userService.findUserById.mockResolvedValue(mockUser);

    const res = await request(app).get('/users/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.username).toBe('mariasilva');
    expect(userService.findUserById).toHaveBeenCalledWith('1');
  });

  it('deve retornar status 404 quando o usuário não for encontrado', async () => {
        userService.findUserById.mockRejectedValue(
            new Error('Usuário não encontrado.')
        );

    const res = await request(app).get('/users/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Usuário não encontrado.');
    expect(userService.findUserById).toHaveBeenCalledWith('999');
  });
});

describe('PUT /users/:id', () => {
  let userService;
  let app;

  beforeEach(() => {
    userService = makeMockUserService();
    app = buildTestApp(userService);
  });

  it('deve atualizar usuário e retornar status 200 com os dados atualizados', async () => {
    const mockUpdated = { id: 1, username: 'carlosm', email: 'carlos@ex.com', fullName: 'Carlos Monteiro' };
    userService.updateUser.mockResolvedValue(mockUpdated);

    const res = await request(app)
      .put('/users/1')
      .send({ fullName: 'Carlos Monteiro' });

    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe('Carlos Monteiro');
    expect(userService.updateUser).toHaveBeenCalledWith('1', { fullName: 'Carlos Monteiro' });
  });
});

describe('DELETE /users/:id', () => {
  let userService;
  let app;

  beforeEach(() => {
    userService = makeMockUserService();
    app = buildTestApp(userService);
  });

  it('deve remover usuário e retornar status 204 sem corpo', async () => {
    userService.deleteUser.mockResolvedValue();

    const res = await request(app).delete('/users/1');

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });
});
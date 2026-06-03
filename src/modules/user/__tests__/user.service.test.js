import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserService } from '../user.service.js';

function makeMockUserModel() {
  return {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  };
}

const validData = {
  username: 'joaosilva',
  email: 'joao@exemplo.com',
  password: 'senha123',
};

describe('UserService › createUser', () => {
  let UserModel;
  let userService;

  beforeEach(() => {
    UserModel = makeMockUserModel();
    userService = createUserService(UserModel);
  });

  it('deve criar usuário com dados válidos', async () => {
    const mockCreated = { id: 1, ...validData };
    UserModel.findOne.mockResolvedValue(null);
    UserModel.create.mockResolvedValue(mockCreated);

    const result = await userService.createUser(validData);

    expect(result).toEqual(mockCreated);
    expect(UserModel.create).toHaveBeenCalledOnce();
  });

  it('deve falhar sem nome de usuário', async () => {
    await expect(userService.createUser({ ...validData, username: '' }))
      .rejects.toThrow('Nome de usuário é obrigatório.');
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it('deve falhar sem email', async () => {
    await expect(userService.createUser({ ...validData, email: '' }))
      .rejects.toThrow('Email é obrigatório.');
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it('deve falhar com email inválido', async () => {
    await expect(userService.createUser({ ...validData, email: 'semArroba' }))
      .rejects.toThrow('Email inválido.');
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it('deve falhar com email já cadastrado', async () => {
    UserModel.findOne.mockResolvedValue({ id: 99, email: validData.email });
    await expect(userService.createUser(validData))
      .rejects.toThrow('Email já cadastrado.');
    expect(UserModel.create).not.toHaveBeenCalled();
  });
});

describe('UserService › findUserById', () => {
  let UserModel;
  let userService;

  beforeEach(() => {
    UserModel = makeMockUserModel();
    userService = createUserService(UserModel);
  });

  it('deve retornar usuário quando ele existe', async () => {
    const mockUser = { id: 1, username: 'joaosilva', email: 'joao@exemplo.com' };
    UserModel.findByPk.mockResolvedValue(mockUser);

    const result = await userService.findUserById(1);

    expect(result).toEqual(mockUser);
    expect(UserModel.findByPk).toHaveBeenCalledWith(1);
  });

  it('deve falhar quando usuário não existir', async () => {
    UserModel.findByPk.mockResolvedValue(null);

    await expect(userService.findUserById(999))
      .rejects.toThrow('Usuário não encontrado.');
  });

  it('deve retornar objeto com propriedades esperadas', async () => {
    const mockUser = { id: 1, username: 'joaosilva', email: 'joao@exemplo.com' };
    UserModel.findByPk.mockResolvedValue(mockUser);

    const result = await userService.findUserById(1);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('email');
  });
});

describe('UserService › updateUser', () => {
  let UserModel;
  let userService;

  beforeEach(() => {
    UserModel = makeMockUserModel();
    userService = createUserService(UserModel);
  });

  it('deve atualizar usuário existente com dados válidos', async () => {
    const mockUser = { id: 1, update: vi.fn().mockResolvedValue(true) };
    UserModel.findByPk.mockResolvedValue(mockUser);

    const result = await userService.updateUser(1, { fullName: 'João Atualizado' });

    expect(mockUser.update).toHaveBeenCalledWith({ fullName: 'João Atualizado' });
    expect(result).toBe(mockUser);
  });

  it('deve falhar ao atualizar usuário inexistente', async () => {
    UserModel.findByPk.mockResolvedValue(null);

    await expect(userService.updateUser(999, { fullName: 'X' }))
      .rejects.toThrow('Usuário não encontrado.');
  });

  it('deve falhar ao atualizar com email inválido', async () => {
    const mockUser = { id: 1, update: vi.fn() };
    UserModel.findByPk.mockResolvedValue(mockUser);

    await expect(userService.updateUser(1, { email: 'email-invalido' }))
      .rejects.toThrow('Email inválido.');
    expect(mockUser.update).not.toHaveBeenCalled();
  });

  it('deve falhar ao atualizar para email já utilizado por outro usuário', async () => {
    const mockUser = { id: 1, update: vi.fn() };
    UserModel.findByPk.mockResolvedValue(mockUser);
    UserModel.findOne.mockResolvedValue({ id: 2, email: 'outro@exemplo.com' });

    await expect(userService.updateUser(1, { email: 'outro@exemplo.com' }))
      .rejects.toThrow('Email já cadastrado.');
    expect(mockUser.update).not.toHaveBeenCalled();
  });
});

describe('UserService › deleteUser', () => {
  let UserModel;
  let userService;

  beforeEach(() => {
    UserModel = makeMockUserModel();
    userService = createUserService(UserModel);
  });

  it('deve remover usuário existente', async () => {
    const mockUser = { id: 1, destroy: vi.fn().mockResolvedValue(true) };
    UserModel.findByPk.mockResolvedValue(mockUser);

    await userService.deleteUser(1);

    expect(mockUser.destroy).toHaveBeenCalledOnce();
  });

  it('deve falhar ao remover usuário inexistente', async () => {
    UserModel.findByPk.mockResolvedValue(null);

    await expect(userService.deleteUser(999))
      .rejects.toThrow('Usuário não encontrado.');
  });

  it('deve chamar findByPk com o id correto antes de remover', async () => {
    const mockUser = { id: 5, destroy: vi.fn().mockResolvedValue(true) };
    UserModel.findByPk.mockResolvedValue(mockUser);

    await userService.deleteUser(5);

    expect(UserModel.findByPk).toHaveBeenCalledWith(5);
  });
});
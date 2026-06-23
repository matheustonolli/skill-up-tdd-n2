import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLessonService } from '../lesson.service.js';

function makeMockLessonModel() {
  return {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
  };
}

const validData = {
  title: 'Introdução ao TDD',
  description: 'Aprenda os conceitos básicos de Test Driven Development',
};

describe('LessonService › Unit Tests', () => {
  let LessonModel;
  let lessonService;

  beforeEach(() => {
    LessonModel = makeMockLessonModel();
    lessonService = createLessonService(LessonModel);
  });

  it('deve criar uma lição com dados válidos', async () => {
    const mockCreated = { id: 1, ...validData, completed: false };
    LessonModel.create.mockResolvedValue(mockCreated);

    const result = await lessonService.createLesson(validData);

    expect(result).toEqual(mockCreated);
    expect(LessonModel.create).toHaveBeenCalledOnce();
  });

  it('deve falhar ao criar lição sem título', async () => {
    await expect(lessonService.createLesson({ ...validData, title: '' }))
      .rejects.toThrow('Título é obrigatório.');
    expect(LessonModel.create).not.toHaveBeenCalled();
  });

  it('deve falhar ao criar lição sem descrição', async () => {
    await expect(lessonService.createLesson({ ...validData, description: '' }))
      .rejects.toThrow('Descrição é obrigatória.');
    expect(LessonModel.create).not.toHaveBeenCalled();
  });

  it('deve retornar uma lista de lições', async () => {
    const mockList = [
      { id: 1, title: 'L1', description: 'D1' },
      { id: 2, title: 'L2', description: 'D2' }
    ];
    LessonModel.findAll.mockResolvedValue(mockList);

    const result = await lessonService.findAll();

    expect(result).toEqual(mockList);
    expect(LessonModel.findAll).toHaveBeenCalledOnce();
  });

  it('deve retornar uma lição quando o ID existe', async () => {
    const mockLesson = { id: 1, ...validData };
    LessonModel.findByPk.mockResolvedValue(mockLesson);

    const result = await lessonService.findLessonById(1);

    expect(result).toEqual(mockLesson);
    expect(LessonModel.findByPk).toHaveBeenCalledWith(1);
  });

  it('deve falhar ao buscar uma lição com ID inexistente', async () => {
    LessonModel.findByPk.mockResolvedValue(null);

    await expect(lessonService.findLessonById(999))
      .rejects.toThrow('Lição não encontrada.');
  });

  it('deve atualizar uma lição existente', async () => {
    const mockLesson = { id: 1, update: vi.fn().mockResolvedValue(true) };
    LessonModel.findByPk.mockResolvedValue(mockLesson);

    const updateData = { title: 'Título Atualizado' };
    const result = await lessonService.updateLesson(1, updateData);

    expect(mockLesson.update).toHaveBeenCalledWith(updateData);
    expect(result).toBe(mockLesson);
  });

  it('deve falhar ao atualizar uma lição inexistente', async () => {
    LessonModel.findByPk.mockResolvedValue(null);

    await expect(lessonService.updateLesson(999, { title: 'X' }))
      .rejects.toThrow('Lição não encontrada.');
  });

  it('deve excluir uma lição existente', async () => {
    const mockLesson = { id: 1, destroy: vi.fn().mockResolvedValue(true) };
    LessonModel.findByPk.mockResolvedValue(mockLesson);

    await lessonService.deleteLesson(1);

    expect(mockLesson.destroy).toHaveBeenCalledOnce();
  });

  it('deve marcar uma lição como concluída', async () => {
    const mockLesson = { id: 1, update: vi.fn().mockResolvedValue(true) };
    LessonModel.findByPk.mockResolvedValue(mockLesson);

    const result = await lessonService.completeLesson(1);

    expect(mockLesson.update).toHaveBeenCalledWith({ completed: true });
    expect(result).toBe(mockLesson);
  });

  it('deve retornar objeto com as propriedades corretas na busca por ID', async () => {
    const mockLesson = { id: 1, title: 'T', description: 'D', completed: false };
    LessonModel.findByPk.mockResolvedValue(mockLesson);

    const result = await lessonService.findLessonById(1);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('completed');
  });
});

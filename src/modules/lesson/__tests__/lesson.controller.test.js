import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createLessonController } from '../lesson.controller.js';

function makeMockLessonService() {
  return {
    createLesson:   vi.fn(),
    findAll:        vi.fn(),
    findLessonById: vi.fn(),
    updateLesson:   vi.fn(),
    deleteLesson:   vi.fn(),
    completeLesson: vi.fn(),
  };
}

function buildTestApp(lessonService) {
  const app = express();
  app.use(express.json());

  const lessonController = createLessonController(lessonService);

  const router = express.Router();
  router.post('/',           lessonController.create);
  router.get('/',            lessonController.findAll);
  router.get('/:id',         lessonController.findById);
  router.put('/:id',         lessonController.update);
  router.delete('/:id',      lessonController.delete);
  router.patch('/:id/complete', lessonController.complete);

  app.use('/lessons', router);
  return app;
}

describe('LessonController › Integration Tests', () => {
  let lessonService;
  let app;

  beforeEach(() => {
    lessonService = makeMockLessonService();
    app = buildTestApp(lessonService);
  });

  it('POST /lessons › deve retornar 201 ao criar lição', async () => {
    const payload = { title: 'TDD', description: 'Desc' };
    const mockLesson = { id: 1, ...payload, completed: false };
    lessonService.createLesson.mockResolvedValue(mockLesson);

    const res = await request(app).post('/lessons').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('TDD');
    expect(lessonService.createLesson).toHaveBeenCalledWith(payload);
  });

  it('POST /lessons › deve retornar 400 ao falhar na criação', async () => {
    lessonService.createLesson.mockRejectedValue(new Error('Título é obrigatório.'));

    const res = await request(app).post('/lessons').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Título é obrigatório.');
  });

  it('GET /lessons › deve retornar 200 e lista de lições', async () => {
    const mockList = [{ id: 1, title: 'L1' }];
    lessonService.findAll.mockResolvedValue(mockList);

    const res = await request(app).get('/lessons');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockList);
  });

  it('GET /lessons/:id › deve retornar 200 ao encontrar lição', async () => {
    const mockLesson = { id: 1, title: 'L1' };
    lessonService.findLessonById.mockResolvedValue(mockLesson);

    const res = await request(app).get('/lessons/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /lessons/:id › deve retornar 404 quando não encontrada', async () => {
    lessonService.findLessonById.mockRejectedValue(new Error('Lição não encontrada.'));

    const res = await request(app).get('/lessons/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Lição não encontrada.');
  });

  it('PUT /lessons/:id › deve retornar 200 ao atualizar lição', async () => {
    const mockUpdated = { id: 1, title: 'Novo Título' };
    lessonService.updateLesson.mockResolvedValue(mockUpdated);

    const res = await request(app).put('/lessons/1').send({ title: 'Novo Título' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Novo Título');
  });

  it('PUT /lessons/:id › deve retornar 404 ao atualizar inexistente', async () => {
    lessonService.updateLesson.mockRejectedValue(new Error('Lição não encontrada.'));

    const res = await request(app).put('/lessons/999').send({ title: 'X' });

    expect(res.status).toBe(404);
  });

  it('DELETE /lessons/:id › deve retornar 204 ao excluir', async () => {
    lessonService.deleteLesson.mockResolvedValue();

    const res = await request(app).delete('/lessons/1');

    expect(res.status).toBe(204);
  });

  it('DELETE /lessons/:id › deve retornar 404 ao excluir inexistente', async () => {
    lessonService.deleteLesson.mockRejectedValue(new Error('Lição não encontrada.'));

    const res = await request(app).delete('/lessons/999');

    expect(res.status).toBe(404);
  });

  it('PATCH /lessons/:id/complete › deve retornar 200 ao concluir', async () => {
    const mockCompleted = { id: 1, completed: true };
    lessonService.completeLesson.mockResolvedValue(mockCompleted);

    const res = await request(app).patch('/lessons/1/complete');

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });
});

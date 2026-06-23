export function createLessonService(LessonModel) {
  async function assertLessonExists(id) {
    const lesson = await LessonModel.findByPk(id);
    if (!lesson) throw new Error('Lição não encontrada.');
    return lesson;
  }

  async function createLesson(data) {
    if (!data.title || data.title.trim() === '')
      throw new Error('Título é obrigatório.');

    if (!data.description || data.description.trim() === '')
      throw new Error('Descrição é obrigatória.');

    return await LessonModel.create(data);
  }

  async function findAll() {
    return await LessonModel.findAll();
  }

  async function findLessonById(id) {
    return await assertLessonExists(id);
  }

  async function updateLesson(id, data) {
    const lesson = await assertLessonExists(id);
    await lesson.update(data);
    return lesson;
  }

  async function deleteLesson(id) {
    const lesson = await assertLessonExists(id);
    await lesson.destroy();
  }

  async function completeLesson(id) {
    const lesson = await assertLessonExists(id);
    await lesson.update({ completed: true });
    return lesson;
  }

  return { 
    createLesson, 
    findAll, 
    findLessonById, 
    updateLesson, 
    deleteLesson, 
    completeLesson 
  };
}

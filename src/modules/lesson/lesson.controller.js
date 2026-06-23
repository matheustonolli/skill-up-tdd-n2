export function createLessonController(lessonService) {
  function sendError(res, status, message) {
    return res.status(status).json({ error: message });
  }

  async function create(req, res) {
    try {
      const lesson = await lessonService.createLesson(req.body);
      res.status(201).json(lesson);
    } catch (err) {
      sendError(res, 400, err.message);
    }
  }

  async function findAll(req, res) {
    const lessons = await lessonService.findAll();
    res.status(200).json(lessons);
  }

  async function findById(req, res) {
    try {
      const lesson = await lessonService.findLessonById(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  async function update(req, res) {
    try {
      const lesson = await lessonService.updateLesson(req.params.id, req.body);
      res.status(200).json(lesson);
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  async function del(req, res) {
    try {
      await lessonService.deleteLesson(req.params.id);
      res.status(204).send();
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  async function complete(req, res) {
    try {
      const lesson = await lessonService.completeLesson(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  return { 
    create, 
    findAll, 
    findById, 
    update, 
    delete: del, 
    complete 
  };
}

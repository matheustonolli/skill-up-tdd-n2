import express from 'express';
import Lesson from './lesson.model.js';
import { createLessonService } from './lesson.service.js';
import { createLessonController } from './lesson.controller.js';

const router = express.Router();
const lessonService = createLessonService(Lesson);
const lessonController = createLessonController(lessonService);

router.post('/lessons', lessonController.create);
router.get('/lessons', lessonController.findAll);
router.get('/lessons/:id', lessonController.findById);
router.put('/lessons/:id', lessonController.update);
router.delete('/lessons/:id', lessonController.delete);
router.patch('/lessons/:id/complete', lessonController.complete);

export default router;

import express from 'express';
import User from './user.model.js';
import { createUserService } from './user.service.js';
import { createUserController } from './user.controller.js';

const router = express.Router();
const userService = createUserService(User);
const userController = createUserController(userService);

router.post('/users', userController.create);
router.get('/users', userController.findAll);
router.get('/users/:id', userController.findById);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;

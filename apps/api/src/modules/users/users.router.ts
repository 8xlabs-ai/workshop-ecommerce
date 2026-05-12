import { Router } from 'express';
import { authRateLimit } from '../../middleware/rate-limit.js';
import { loginBody, registerBody } from './users.schemas.js';
import { usersService } from './users.service.js';

export const usersRouter: Router = Router();

usersRouter.post('/login', authRateLimit, async (req, res, next) => {
  try {
    const parsed = loginBody.parse(req.body);
    const result = await usersService.login(parsed);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/register', authRateLimit, async (req, res, next) => {
  try {
    const parsed = registerBody.parse(req.body);
    const result = await usersService.register(parsed);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

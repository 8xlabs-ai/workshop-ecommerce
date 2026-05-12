import { Router } from 'express';
import { NotFoundError } from '../../lib/errors.js';
import { catalogRepository } from './catalog.repository.js';
import { listQuery, productIdParam } from './catalog.schemas.js';

export const catalogRouter: Router = Router();

catalogRouter.get('/products', async (req, res, next) => {
  try {
    const q = listQuery.parse(req.query);
    const result = await catalogRepository.list(q);
    res.json({
      page: q.page,
      pageSize: q.pageSize,
      total: result.total,
      items: result.items,
    });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = productIdParam.parse(req.params);
    const product = await catalogRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

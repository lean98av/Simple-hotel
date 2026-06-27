import { Router, Response, NextFunction } from 'express';
import adminOrdersController from '../controllers/adminOrdersController';
import { Request } from 'express';
import { adminAuthMiddleware, adminAuthPostMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticación para rutas protegidas

// Orders routes
router.get('/', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminOrdersController.adminOrders(req, res, next);
});

router.get('/loadMore', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminOrdersController.loadMoreOrders(req, res, next);
});

router.post('/:id/update', adminAuthPostMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminOrdersController.updateOrder(req, res, next);
});

export default router;

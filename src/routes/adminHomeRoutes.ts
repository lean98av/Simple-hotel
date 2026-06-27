import { Router, Response, NextFunction } from 'express';
import adminController from '../controllers/adminHomeController';
import { Request } from 'express';
import { adminAuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticación para rutas protegidas

// Rutas del admin panel (protegidas por autenticación con token en header)
router.get('/', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminController.home(req, res, next);
});

// Ruta alternativa /home para dashboard
router.get('/home', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminController.home(req, res, next);
});

export default router;

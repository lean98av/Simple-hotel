import { Router, Response, NextFunction } from 'express';
import adminLoginController from '../controllers/adminLoginController';
import { Request } from 'express';

const router = Router();

// Login routes - no protected (handled by controller)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await adminLoginController.loginPage(req, res, next);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await adminLoginController.loginPost(req, res, next);
});

router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
  await adminLoginController.logout(req, res, next);
});

export default router;

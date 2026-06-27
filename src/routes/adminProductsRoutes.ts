import { Router, Response, NextFunction } from 'express';
import adminProductsController from '../controllers/adminProductsController';
import { Request } from 'express';
import { adminAuthMiddleware, adminAuthPostMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticación para rutas protegidas

// Products routes
router.get('/', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminProductsController.adminProducts(req, res, next);
});

router.get('/create', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminProductsController.createProductPage(req, res, next);
});

router.get('/:id/edit', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await adminProductsController.getEditProduct(req, res, next);
});

router.get('/:id', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminProductsController.getProduct(req, res, next);
});

router.post(
  '/',
  adminProductsController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminProductsController.createProduct(req, res, next);
  }
);

router.put(
  '/:id',
  adminProductsController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminProductsController.editProduct(req, res, next);
  }
);

router.delete('/:id/deleteImage', async (req: Request, res: Response, next: NextFunction) => {
  await adminProductsController.deleteImage(req, res, next);
});

router.delete('/:id', adminAuthPostMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminProductsController.deleteProduct(req, res, next);
});

export default router;

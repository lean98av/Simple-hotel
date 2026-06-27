import { Router, Response, NextFunction } from 'express';
import adminCategoriesController from '../controllers/adminCategoriesController';
import { Request } from 'express';
import Category from '../models/category';
import { adminAuthMiddleware, adminAuthPostMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticación para rutas protegidas

// Categorías routes
router.get('/', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminCategoriesController.adminCategories(req, res, next);
});

router.get('/create', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.findAll();
  await res.render('admin/createEditCategory', {
    title: 'Crear Categoría',
    category: null,
    categories,
  });
});

router.get('/:id/edit', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await adminCategoriesController.getEditCategory(req, res, next);
});

router.get('/:id', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminCategoriesController.getCategory(req, res, next);
});

router.post(
  '/',
  adminCategoriesController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminCategoriesController.createCategory(req, res, next);
  }
);

router.put(
 ('/:id'),
  adminCategoriesController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminCategoriesController.editCategory(req, res, next);
  }
);

router.delete('/:id/deleteImage', async (req: Request, res: Response, next: NextFunction) => {
  await adminCategoriesController.deleteCategoryImage(req, res, next);
});

router.delete('/:id', adminAuthPostMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminCategoriesController.deleteCategory(req, res, next);
});

export default router;

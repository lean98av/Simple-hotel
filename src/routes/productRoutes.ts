import { Router, Response } from 'express';
import productController from '../controllers/productController';

const router = Router();

router.get('/', productController.getAllSuitCategories);
router.get('/getTopBarUpdated', productController.getTopBarUpdated);
router.get('/:id', productController.getSuitCategoryById);
export default router;

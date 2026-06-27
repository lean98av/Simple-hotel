import { Router, Response } from 'express';
import productController from '../controllers/productController';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/getTopBarUpdated', productController.getTopBarUpdated);
router.get('/:id', productController.getProductDetailPage);
export default router;

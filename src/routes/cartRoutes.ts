import { Router } from 'express';
import CartController from '../controllers/cartController';

const router = Router();

const cartController = new CartController();

router.get('/', cartController.getCart);

router.get('/add/:id', cartController.addProduct);

export default router;
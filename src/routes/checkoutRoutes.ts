import { Router } from "express";
import CartController from "../controllers/cartController";

const router = Router();

const cartController = new CartController();

router.get('/', cartController.checkoutPage);

router.post('/', cartController.createOrder);

router.get('/success', cartController.checkoutSuccess.bind(cartController));

export default router;
import { Router } from "express";
import CartController from "../controllers/cartController";

const router = Router();

const cartController = new CartController();

router.get('/', cartController.checkoutPage);

router.post('/', cartController.createBooking);

router.get('/success', cartController.checkoutSuccess);

export default router;
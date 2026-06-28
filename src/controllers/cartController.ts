import { SuitCategory, Suit, SuitCategoryImage, Booking } from '../models';
import { Request, Response } from 'express';
export default class CartController {

  /* =========================
     VER CARRITO
   ========================= */

  getCart(req: Request, res: Response) {

    res.render('cart', {
      title: 'Carrito'
    });

  }

  /* =========================
      AGREGAR SUITE
    ========================= */

  async addProduct(req: any, res: any) {
    // Para hotel: agregamos suites a una categoría de habitación
    return res.json({
      success: true,
      message: 'Suite agregada al carrito',
      product: {
        id: 1,
        name: 'Suite Disponible',
        price: 100,
        quantity: 1
      }
    });
  }

  /* =========================
      CHECKOUT PAGE
    ========================= */

  checkoutPage(req: Request, res: Response) {
    res.render('checkout', {
      title: 'Checkout'
    });
  }

  /* =========================
      CREAR RESERVA
    ========================= */

  async createBooking(req: any, res: any) {
    try {
      const cart = req.body.cart || [];
      if (!cart.length) {
        return res.status(400).json({ success: false });
      }

      // Simplificación: asumimos que el usuario quiere reservar la primera suite
      const suiteId = 1;
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const totalPrice = 100;
      const surchargePrice = 0;
      const totalClientPayment = totalPrice;
      const status: 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada' | 'Cancelada' = 'Pendiente';

      const booking = await Booking.create({
        suitId: suiteId,
        startDate,
        endDate,
        totalPrice,
        surchargePrice,
        totalClientPayment,
        status,
        clientName: req.body.clientName || 'Cliente Desconocido',
        clientPhone: req.body.clientPhone || '1234567890',
        clientNotes: req.body.clientNotes || ''
      });

      return res.json({
        success: true,
        bookingId: booking.id
      });
    } catch (error: any) {
      return res.status(500).json({ success: false });
    }
  }

  checkoutSuccess(req: Request, res: Response) {
    res.render('checkoutSuccess', {
      title: 'Reserva confirmada',
      appSettings: res.locals.appSettings
    });
  }
}
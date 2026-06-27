import Product from '../models/product';
import { Category, ProductImage } from '../models';
import { Request, Response } from 'express';
import Order from '../models/order';
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
      AGREGAR PRODUCTO
    ========================= */

  async addProduct(req: any, res: any) {

    const product = await Product.findOne({
      where: {
        id: req.params.id,
        deleted: false
      },
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: ProductImage,
          as: 'images',
          order: [['order', 'ASC']]
        }
      ]
    });

    const productImage = await ProductImage.findOne({
      where: {
        productId: product?.id,
        order: 1
      }
    });

    if (!product) {

      return res.json({
        success: false
      });

    }

    return res.json({

      success: true,

      product: {

        id: product.id,

        name: product.name,

        price: product.price,

        quantity: 1,

        image: productImage

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
      CREAR ORDEN
   ========================= */

 async createOrder(req: any, res: any) {

  function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>?/gm, "")   // elimina cualquier etiqueta HTML
    .replace(/["'`;]/g, "");     // elimina comillas y caracteres peligrosos
}
  try {

   const cart = req.body.cart || [];
    if (!cart.length) {

      return res.status(400).json({
        success: false
      });

    }

    let total = 0;

    let products: string[] = [];

    cart.forEach((item: any) => {

      total +=
        Number(item.price) *
        Number(item.quantity);

      products.push(
        `${item.id}:${item.quantity}`
      );

    });

   const clientName = sanitizeInput(req.body.clientName);
    const clientPhone = sanitizeInput(req.body.clientPhone);
    const address = sanitizeInput(req.body.address);
    const clientNotes = sanitizeInput(req.body.clientNotes || "");
    
    // Formatear total para evitar decimales innecesarios (ej: 10000.00 -> 10000)
   const formattedTotal = Number(total.toFixed(2));
   
   const order = await Order.create({
      total: formattedTotal,
      products: products.join(","),
      clientName,
      clientPhone,
      address,
      clientNotes,
      status: "Nuevo"
    });
    return res.json({

      success: true,

      orderId: order.id

    });

  } catch (error) {

    return res.status(500).json({

      success: false

    });

  }

}
  checkoutSuccess(req: Request, res: Response) {

    res.render('checkoutSuccess', {
      title: 'Pedido confirmado',
      appSettings: res.locals.appSettings
    });

  }
}
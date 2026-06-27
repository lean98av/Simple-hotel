import { Request, Response, NextFunction } from 'express';
import Product, { ProductAttributes } from '../models/product';
import ProductImage from '../models/productImage';
import sequelize from '../config/db';
import { Category } from '../models';
import path from 'path';

// Global localStorage declaration for browser API in Node
interface GlobalLocalStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

declare global {
  const localStorage: GlobalLocalStorage;
}

export default {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { showToClients = true } = req.query;

      const products = await Product.findAndCountAll({
        where: {
          deleted: false,
          ...(showToClients === 'false' && { showToClients: false }),
        },
        include: [
          { model: Category, as: 'category' },
          { model: ProductImage, as: 'images', order: [['order', 'DESC']] },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json({
        success: true,
        data: products.rows,
        count: products.count,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id, deleted: false },
        include: [
          { model: Category, as: 'category' },
          { model: ProductImage, as: 'images' },
        ],
      });

      if (!product) {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async getProductDetailPage(req: Request, res: Response, next: NextFunction) {

    try {

      const product = await Product.findOne({
        where: { id: req.params.id, deleted: false },
        include: [
          { model: Category, as: 'category' },
          { model: ProductImage, as: 'images' },
        ],
      });

      if (!product) {
        return res.status(404).render('404');
      }
     res.render('details', {
        product,
        category: product.categoryId,
        title: product.name
      });

    } catch (error) {

      next(error);

    }
  },

async getTopBarUpdated(req: Request, res: Response, next: NextFunction) {
  try {
    // Renderizamos el partial "topbar" usando el motor de vistas de Express
    // Pasamos las variables necesarias (ejemplo: carrito en localStorage)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    res.render('partials/topbar', {
      cart: cart
    }, (err, html) => {
      if (err) {
        return next(err);
      }
      // Devolvemos el HTML ya renderizado
      res.json({ html });
    });
  } catch (error) {
    next(error);
  }
}

};

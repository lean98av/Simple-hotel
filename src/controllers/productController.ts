import { Request, Response, NextFunction } from 'express';
import { SuitCategory, Suit, SuitCategoryImage } from '../models';
import sequelize from '../config/db';
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
  async getAllSuitCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { showToClients = true } = req.query;

      const suitCategories = await SuitCategory.findAndCountAll({
        where: {
          deleted: false,
          ...(showToClients === 'false' && { showToClients: false }),
        },
        include: [
          { model: SuitCategoryImage, as: 'images', order: [['order', 'DESC']] },
        ],
        order: [['signPrice', 'ASC']],
      });

      res.json({
        success: true,
        data: suitCategories.rows,
        count: suitCategories.count,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSuitCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const suitCategory = await SuitCategory.findOne({
        where: { id, deleted: false },
        include: [
          { model: SuitCategoryImage, as: 'images' },
        ],
      });

      if (!suitCategory) {
        res.status(404).json({ success: false, message: 'Categoría de habitación no encontrada' });
        return;
      }

      res.json({ success: true, data: suitCategory });
    } catch (error) {
      next(error);
    }
  },

  async getSuitCategoryDetailPage(req: Request, res: Response, next: NextFunction) {
    try {
      const suitCategory = await SuitCategory.findOne({
        where: { id: req.params.id, deleted: false },
        include: [
          { model: SuitCategoryImage, as: 'images' },
        ],
      });

      if (!suitCategory) {
        return res.status(404).render('404');
      }

      res.render('suitCategoryDetails', {
        suitCategory,
        title: suitCategory.name
      });
    } catch (error) {
      next(error);
    }
  },

  async getSuitCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const suitCategories = await SuitCategory.findAll({
        where: { deleted: false },
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1 },
        ],
      });

      res.render('suitCategoriesList', {
        suitCategories,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTopBarUpdated(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      res.render('partials/topbar', {
        cart: cart,
      });
    } catch (error) {
      next(error);
    }
  },
};

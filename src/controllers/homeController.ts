import { Request, Response } from 'express';
import { Home } from '../models/home';
import { Category } from '../models/category';
import { CategoryImage, Product, ProductImage } from '../models';
import { Announcement } from '../models/announcement';
import AnnouncementImage from '../models/announcementImage';
import { Op } from 'sequelize';
import order from '../models/order';

export class HomeController {
  static async home(req: Request, res: Response) {
    const categories = await Category.findAll({
      where: { deleted: false, showToClients: true },
      include: [
        { model: CategoryImage, as: 'images', limit: 1 },
      ],
    });

    const announcements = await Announcement.findAll({
      where: {
        deleted: false,
        [Op.and]: [
          { startDate: { [Op.lte]: new Date() } },
          { endDate: { [Op.gte]: new Date() } },
        ],
      },
      include: [{ model: AnnouncementImage, as: 'images', limit: 1 }],
    });

    const allProducts = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: ProductImage, as: 'images' },
      ],
      where: {
        deleted: false,
        showToClients: true,
      },
      order: [['price', 'ASC']],
    });

    const categoryIdMap = new Set<number>();
    allProducts.forEach((product) => {
      categoryIdMap.add(product.categoryId);
    });

    // Filtrar categorías que tienen al menos 1 producto
    const categoriesWithProducts = categories.filter((category) =>
      categoryIdMap.has(category.id)
    );

    res.render('home', { categories: categoriesWithProducts, announcements, topProducts: allProducts.filter(p => p.topProduct == true) });
  }
}
  
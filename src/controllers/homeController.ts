import { Request, Response } from 'express';
import { Category } from '../models/category';
import { Announcement } from '../models/announcement';
import AnnouncementImage from '../models/announcementImage';
import { Op } from 'sequelize';
import { SuitCategory, SuitCategoryImage, Suit } from '../models';

export class HomeController {
  static async home(req: Request, res: Response) {
   

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

    const allSuitCategories = await SuitCategory.findAll({
      where: { deleted: false, showToClients: true },
      include: [
        { model: SuitCategoryImage, as: 'images', limit: 1 },
      ],
    });

    const categoryIdMap = new Set<number>();
    allSuitCategories.forEach((category) => {
      categoryIdMap.add(category.id);
    });

    // Filtrar categorías que tienen al menos 1 suite
    const categoriesWithSuites = allSuitCategories.filter((category) =>
      categoryIdMap.has(category.id)
    );

    res.render('home', { categories: categoriesWithSuites, announcements, topProducts: [] });
  }
}
  
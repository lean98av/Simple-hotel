import { Router, Response } from 'express';
import { SuitCategory, SuitCategoryImage } from '../models';
import { Op } from 'sequelize';

const router = Router();

router.get('/', async (req: { query: { q?: string } }, res: Response) => {
  try {
    const { q = '' } = req.query;
    const search = q.toLowerCase();

    const suitCategories = await SuitCategory.findAll({
      where: {
        showToClients: true,
        deleted: false,
        ...(search && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }),
      },
      include: [
        { model: SuitCategoryImage, as: 'images', limit: 1 },
      ],
    });

    res.json({ success: true, data: suitCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en la búsqueda' });
  }
});

export default router;

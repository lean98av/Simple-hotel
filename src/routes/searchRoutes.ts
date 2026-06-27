import { Router, Response, NextFunction } from 'express';
import Product, { ProductAttributes } from '../models/product';
import { Op } from 'sequelize';

const router = Router();

router.get('/', async (req: { query: { q?: string } }, res: Response) => {
  try {
    const { q = '' } = (req as any).query;
    const search = q.toLowerCase();

    const products = await Product.findAll({
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
      include: [{ model: Product, as: 'category' }],
    });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en la búsqueda' });
  }
});

export default router;

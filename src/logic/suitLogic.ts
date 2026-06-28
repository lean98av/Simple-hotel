import Suit from '../models/suit';
import SuitCategory from '../models/suitCategory';
import sharp from 'sharp';

export default {
  async getSuitsByCategory(categoryId: number): Promise<Suit[]> {
    return Suit.findAll({
      where: { suitCategoryId: categoryId },
      order: [['number', 'ASC']],
    });
  },

  async getSuitsByStatus(status: string): Promise<Suit[]> {
    return Suit.findAll({
      where: { status },
      order: [['number', 'ASC']],
    });
  },

  async getSuitsWithPagination(
    page: number,
    limit: number,
    statusFilter?: string,
    categoryFilter?: string
  ): Promise<{ suits: Suit[]; totalPages: number; currentPage: number }> {
    let whereClause: any = {};
    if (statusFilter && statusFilter !== 'all') {
      whereClause.status = statusFilter;
    }
    if (categoryFilter && categoryFilter !== 'all') {
      whereClause.suitCategoryId = parseInt(categoryFilter);
    }

    const totalSuits = await Suit.count({ where: whereClause });
    const totalPages = Math.ceil(totalSuits / limit);
    const offset = (page - 1) * limit;

    const suits = await Suit.findAll({
      where: whereClause,
      order: [['number', 'ASC']],
      limit,
      offset,
    });

    return { suits, totalPages, currentPage: page };
  },

  async getSuitsWithoutPagination(
    page: number,
    limit: number,
    statusFilter?: string,
    categoryFilter?: string
  ): Promise<{ suits: Suit[]; totalPages: number }> {
    let whereClause: any = {};
    if (statusFilter && statusFilter !== 'all') {
      whereClause.status = statusFilter;
    }
    if (categoryFilter && categoryFilter !== 'all') {
      whereClause.suitCategoryId = parseInt(categoryFilter);
    }

    const totalSuits = await Suit.count({ where: whereClause });
    const totalPages = Math.ceil(totalSuits / limit);
    const offset = (page - 1) * limit;

    const suits = await Suit.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['number', 'ASC']],
    });

    return { suits, totalPages };
  },

  async getSuitById(id: string): Promise<Suit | null> {
    const suit = await Suit.findByPk(id);
    return suit || null;
  },

  async createSuitData(
    number: string,
    suitCategoryId: string,
    status: 'disponible' | 'no disponible' | 'en mantenimiento' | 'en limpieza' | 'ocupada'
  ): Promise<{ suit: Suit; files: any[] }> {
    const suitData = {
      number,
      suitCategoryId: parseInt(suitCategoryId),
      status,
      deleted: false,
    };

    const suit = await Suit.create(suitData);
    return { suit, files: [] };
  },

  async editSuitData(
    id: string,
    number: string,
    suitCategoryId: string,
    status: 'disponible' | 'no disponible' | 'en mantenimiento' | 'en limpieza' | 'ocupada'
  ): Promise<Suit | null> {
    const suit = await Suit.findByPk(id);
    if (!suit) {
      return null;
    }

    await suit.update({
      number,
      suitCategoryId: parseInt(suitCategoryId),
      status,
    });

    return suit;
  },

  async compressImage(
    buffer: Buffer,
    maxSizeBytes: number = 2 * 1024 * 1024
  ): Promise<Buffer> {
    try {
      const metadata = await sharp(buffer).metadata();
      const targetWidth = Math.min(metadata.width ?? 720, 720);

      let quality = 80;
      let output = await sharp(buffer)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      while (output.length > maxSizeBytes && quality > 30) {
        quality -= 5;
        output = await sharp(buffer)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
      }

      return output;
    } catch (error: any) {
      throw new Error(`Error al comprimir imagen: ${error.message}`);
    }
  },
};

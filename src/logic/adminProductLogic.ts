import { SuitCategory, Suit, SuitCategoryImage } from '../models';
import sharp from 'sharp';

export default {
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

    async getSuitCategories(): Promise<any[]> {
      return SuitCategory.findAll({
        where: { deleted: false },
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1 },
        ],
      });
    },

    async getSuitCategoriesWithFilters(where: any = {}): Promise<any[]> {
      const includeImages = process.env.INCLUDE_IMAGES_ADMIN_SUIT_CATEGORIES === 'true';

      const baseWhere: any = {
        deleted: false,
        ...where,
      };

      return SuitCategory.findAll({
        where: baseWhere,
        include: [
          ...(includeImages ? [
            {
              model: SuitCategoryImage,
              as: 'images',
              limit: 1
            },
          ] : []),
        ],
      });
    },

    async getSuitCategoryById(id: string): Promise<any | null> {
      const suitCategory = await SuitCategory.findByPk(id, {
        include: [
          { model: SuitCategoryImage, as: 'images', order: [['order', 'ASC']] },
        ],
      });

      return suitCategory || null;
    },

    async createSuitCategoryData(
      name: string,
      description: string,
      showToClients: string,
      signPrice: string
    ): Promise<{ suitCategory: SuitCategory; files: any[] }> {
      const suitCategoryData = {
        name,
        description,
        showToClients: showToClients === 'true',
        signPrice: parseFloat(signPrice),
        deleted: false,
      };

      const suitCategory = await SuitCategory.create(suitCategoryData);
      return { suitCategory, files: [] };
    },

    async editSuitCategoryData(
      id: string,
      name: string,
      description: string,
      showToClients: string,
      signPrice: string
    ): Promise<SuitCategory | null> {
      const suitCategory = await SuitCategory.findByPk(id);
      if (!suitCategory) {
        return null;
      }

      await suitCategory.update({
        name,
        description,
        showToClients: showToClients === 'true',
        signPrice: parseFloat(signPrice),
        deleted: false,
      });

      return suitCategory;
    },

    async getSuitCategoryData(id: string): Promise<any | null> {
      const suitCategory = await SuitCategory.findByPk(id, {
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1, order: [['order', 'ASC']] },
        ],
      });

      return suitCategory || null;
    },

    async deleteSuitCategoryData(id: string): Promise<boolean> {
      const suitCategory = await SuitCategory.findByPk(id);

      if (!suitCategory) {
        return false;
      }

      await SuitCategoryImage.destroy({
        where: { suitCategoryId: id },
      });

      await suitCategory.update({
        deleted: true,
      });

      return true;
    },

    async deleteSuitCategoryImageData(id: string): Promise<boolean> {
      const suitCategoryId = parseInt(id);

      const suitCategory = await SuitCategory.findByPk(suitCategoryId);
      if (!suitCategory) {
        return false;
      }

      await SuitCategoryImage.destroy({ where: { suitCategoryId } });

      return true;
    },

    // Nuevas funciones para productos
    async createProductData(
      name: string,
      signPrice: number,
      description: string,
      showToClients: string,
      outStock: string,
      topProduct: string
    ): Promise<{ product: SuitCategory; files: any[] }> {
      const productData = {
        name,
        signPrice, // Usamos signPrice en lugar de price
        description,
        showToClients: showToClients === 'true',
        deleted: false,
      };

      const product = await SuitCategory.create(productData);
      return { product, files: [] };
    },

    async editProductData(
      id: string,
      name: string,
      signPrice: number,
      description: string,
      showToClients: string,
      outStock: string,
      topProduct: string
    ): Promise<SuitCategory | null> {
      const product = await SuitCategory.findByPk(id);
      if (!product) {
        return null;
      }

      await product.update({
        name,
        signPrice,
        description,
        showToClients: showToClients === 'true',
        deleted: false,
      });

      return product;
    },

    async getProductData(id: string): Promise<any | null> {
      const product = await SuitCategory.findByPk(id, {
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1 },
        ],
      });
      return product || null;
    },

    async getProductById(id: string): Promise<SuitCategory | null> {
      return await SuitCategory.findByPk(id);
    },

    async getProductsWithFilters(
      categoryFilter: string,
      where: any
    ): Promise<any[]> {
      return SuitCategory.findAll({
        where: {
          ...where,
          ...(categoryFilter && categoryFilter !== 'all' ? { categoryId: parseInt(categoryFilter) } : {}),
        },
      });
    },

    async deleteProductData(id: string): Promise<boolean> {
      const product = await SuitCategory.findByPk(id);

      if (!product) {
        return false;
      }

      await product.update({ deleted: true });

      return true;
    },

    async deleteImageData(id: string, order: string): Promise<boolean> {
      const productId = parseInt(id);
      const orderNum = parseInt(order);

      const product = await SuitCategory.findByPk(productId);
      if (!product) {
        return false;
      }

      // Eliminar imagen con ese orden
      await SuitCategoryImage.destroy({
        where: { suitCategoryId: productId, order: orderNum },
      });

      return true;
    },
};

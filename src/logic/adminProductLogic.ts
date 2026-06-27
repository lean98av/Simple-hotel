import { Category } from '../models';
import Product from '../models/product';
import ProductImage from '../models/productImage';
import sharp from 'sharp';

export default {
    async compressImage(
      buffer: Buffer,
      maxSizeBytes: number = 2 * 1024 * 1024
    ): Promise<Buffer> {
      try {
        const metadata = await sharp(buffer).metadata();

        // Para móviles: limitar ancho a 720px
        const targetWidth = Math.min(metadata.width ?? 720, 720);

        let quality = 80;
        let output = await sharp(buffer)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .webp({ quality }) // WebP suele ser más eficiente que JPEG
          .toBuffer();

        // Reducir calidad en pasos de 5 hasta que entre en el límite
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

    async getProducts(): Promise<any[]> {
      return Product.findAll({
        where: { deleted: false },
        include: [
          { model: Category, as: 'category' },
          {
            model: ProductImage,
            as: 'images',
            limit: 1,
            order: [['order', 'ASC']]
          },
        ],
      });
    },

    async getProductsWithFilters(categoryId: string = 'all', where: any = {}): Promise<any[]> {
      const includeImages = process.env.INCLUDE_IMAGES_ADMIN_PRODUCTS === 'true';

      // Base where clause
      const baseWhere: any = {
        deleted: false,
        ...where,
      };

      // Add category filter if specified
      if (categoryId !== 'all') {
        baseWhere.categoryId = parseInt(categoryId);
      }

      return Product.findAll({
        where: baseWhere,
        include: [
          { model: Category, as: 'category' },
          ...(includeImages ? [
            {
              model: ProductImage,
              as: 'images',
              limit: 1
            },
          ] : []),
        ],
      });
    },

    async getProductById(id: string): Promise<any | null> {
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: ProductImage, as: 'images', order: [['order', 'ASC']] },
        ],
      });

      return product || null;
    },

    async createProductData(
      name: string,
      price: string,
      categoryId: string,
      description: string,
      showToClients: string,
      outStock: string,
      topProduct: string
    ): Promise<{ product: Product; files: any[] }> {
      const productData = {
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        description,
        showToClients: showToClients === 'true',
        outStock: outStock === 'true',
        topProduct: topProduct === 'true',
        deleted: false,
      };

      const product = await Product.create(productData);
      return { product, files: [] };
    },

    async editProductData(
      id: string,
      name: string,
      price: string,
      categoryId: string,
      description: string,
      showToClients: string,
      outStock: string,
      topProduct: string
    ): Promise<any | null> {
      const product = await Product.findByPk(id);
      if (!product) {
        return null;
      }

      await product.update({
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        description,
        showToClients: showToClients === 'true',
        outStock: outStock === 'true',
        topProduct: topProduct === 'true',
      });

      return product;
    },

    async getProductData(id: string): Promise<any | null> {
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: ProductImage, as: 'images', limit: 1, order: [['order', 'ASC']] },
        ],
      });

      return product || null;
    },

    async deleteProductData(id: string): Promise<boolean> {
      const product = await Product.findByPk(id);

      if (!product) {
        return false;
      }

      // Delete associated images
      await ProductImage.destroy({
        where: { productId: id },
      });

      // Soft delete - mark as deleted instead of destroying
      await product.update({
        deleted: true,
      });

      return true;
    },

    async deleteImageData(id: string, order: string): Promise<boolean> {
      const productId = parseInt(id);
      const orderNum = parseInt(order);

      if (orderNum < 1 || orderNum > 4) {
        return false;
      }

      const product = await Product.findByPk(id);
      if (!product) {
        return false;
      }

      await ProductImage.destroy({ where: { productId, order: orderNum } });

      return true;
    },
};

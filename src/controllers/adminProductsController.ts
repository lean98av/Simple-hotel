import { Request, Response, NextFunction } from 'express';
import { SuitCategoryImage } from '../models';
import multer from 'multer';
import adminProductLogic from '../logic/adminProductLogic';
import adminCategoryLogic from '../logic/adminCategoryLogic';

const JWT_SECRET = process.env.JWT_SECRET || 'gossip-cases-secret-key-change-in-prod';

export default {
  upload: multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: any, file: any, cb: any) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten imágenes JPG, PNG, GIF y WebP'));
      }
    },
  }),

  // Métodos que retornan vistas

  async adminProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Prefer query params, fallback to cookie `adminFilters` when present
      let cookieFilters: any = {};
      try {
        const raw = req.cookies && req.cookies.adminFilters;
        if (raw) cookieFilters = JSON.parse(raw);
      } catch (err) {
        cookieFilters = {};
      }

      const categoryFilter = (req.query.categoryFilter as string) || cookieFilters.categoryFilter || 'all';
      const showToClientsFilter = (req.query.showToClients !== undefined)
        ? req.query.showToClients === 'true'
        : (cookieFilters.showToClients === 'true' || cookieFilters.showToClients === true) || false;
      const outStockFilter = (req.query.outStock !== undefined)
        ? req.query.outStock === 'true'
        : (cookieFilters.outStock === 'true' || cookieFilters.outStock === true) || false;
      const topProductFilter = (req.query.topProduct !== undefined)
        ? req.query.topProduct === 'true'
        : (cookieFilters.topProduct === 'true' || cookieFilters.topProduct === true) || false;
      let products;

      let where :any= { deleted: false };

      if (categoryFilter && categoryFilter !== 'all') {
        where.categoryId = parseInt(categoryFilter);
      }

      if (showToClientsFilter !== undefined) {
        where.showToClients = showToClientsFilter;
      }

      if (outStockFilter !== undefined) {
        where.outStock = outStockFilter;
      }

      if (topProductFilter !== undefined) {
        where.topProduct = topProductFilter;
      }

      products = await adminProductLogic.getProductsWithFilters('all', where);

      const categories = await adminCategoryLogic.getAllCategories();

      res.setHeader("Cache-Control", "no-store");
      res.render('admin/adminProducts', {
        title: 'Admin - Productos',
        products,
        categories,
        categoryFilter,
        showToClientsFilter,
        outStockFilter,
        topProductFilter,
      });
    } catch (error: any) {
      console.error('Error en adminProducts:', error);
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
      next(error);
    }
  },

  async getEditProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await adminProductLogic.getProductById(id);

      if (!product) {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
        return;
      }

      const categories = await adminCategoryLogic.getAllCategories();

      res.render('admin/createEditProduct', {
        title: 'Editar Producto',
        product,
        categories,
      });
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, signPrice, description, showToClients, outStock, topProduct } = req.body;
      const files = Array.isArray(req.files) ? req.files : (req.files as any).images || [];

      const productAndFiles = await adminProductLogic.createProductData(
        name,
        signPrice,
        description,
        showToClients,
        outStock,
        topProduct
      );

      const product = productAndFiles.product;
      const filesData = Array.isArray(req.files) ? req.files : (req.files as any).images || [];

      for (let i = 0; i < filesData.length && i <= 4; i++) {
        const file = filesData[i];
        if (!file) break;

        const compressedBuffer = await adminProductLogic.compressImage(file.buffer);

        await SuitCategoryImage.create({
          suitCategoryId: product.id,
          name: file.originalname,
          file: compressedBuffer.toString('base64'),
          order: i + 1,
        });
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, signPrice, description, showToClients, outStock, topProduct } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const allFiles = Object.values(files).flat();

      const updatedProduct = await adminProductLogic.editProductData(
        id,
        name,
        signPrice,
        description,
        showToClients,
        outStock,
        topProduct
      );

      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      const product = updatedProduct;

      for (const file of allFiles) {
        const order = Number(file.originalname);

        if (order >= 1 && order <= 4) {
          const compressedBuffer = await adminProductLogic.compressImage(file.buffer);

          await SuitCategoryImage.destroy({ where: { suitCategoryId: product.id, order } });

          await SuitCategoryImage.create({
            suitCategoryId: product.id,
            name: String(order),
            file: compressedBuffer.toString('base64'),
            order,
          });
        }
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await adminProductLogic.getProductData(id);

      if (!product) {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deleted = await adminProductLogic.deleteProductData(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
        return;
      }

      res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  },

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, order } = req.body;

      if (!id || !order) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos' });
      }

      const deleted = await adminProductLogic.deleteImageData(id, order);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({ success: true, message: 'Imagen eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  },

  async createProductPage(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await adminCategoryLogic.getAllCategories();
      res.render('admin/createEditProduct', {
        title: 'Crear Producto',
        product: null,
        categories,
      });
    } catch (error) {
      next(error);
    }
  },
};

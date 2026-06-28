import { Request, Response, NextFunction } from 'express';
import CategoryImage from '../models/categoryImage';
import multer from 'multer';
import adminCategoryLogic from '../logic/adminCategoryLogic';
import adminProductLogic from '../logic/adminProductLogic';

export default {
  upload: multer({
    storage: multer.memoryStorage(),
    // limits: { fileSize: 2 * 1024 * 1024 },
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

  async adminCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await adminCategoryLogic.getAllCategories();

      res.render('admin/adminCategories', {
        title: 'Admin - Categorías',
        categories,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEditCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await adminCategoryLogic.getCategoryData(id);

      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.render('admin/createEditCategory', {
        title: 'Editar Categoría',
        category,
      });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, showToClients, signPrice } = req.body;
      const files = Array.isArray(req.files) ? req.files : (req.files as any).images || [];

      const categoryAndFiles = await adminCategoryLogic.createCategoryData(
        name,
        description,
        showToClients === 'true' ? 'true' : 'false',
        signPrice || '0'
      );

      const category = categoryAndFiles.category;
      const filesData = Array.isArray(req.files) ? req.files : (req.files as any).images || [];

      for (let i = 0; i < filesData.length && i <= 1; i++) {
        const file = filesData[i];
        if (!file) break;

        const compressedBuffer = await adminProductLogic.compressImage(file.buffer);

        await CategoryImage.create({
          categoryId: category.id,
          file: compressedBuffer.toString('base64'),
        });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, showToClients, signPrice } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const allFiles = Object.values(files).flat();

      const updatedCategory = await adminCategoryLogic.editCategoryData(
        id,
        name,
        description,
        showToClients === 'true' ? 'true' : 'false',
        signPrice || '0'
      );

      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      const category = updatedCategory;

      if (allFiles.length > 0) {
        const compressedBuffer = await adminProductLogic.compressImage(allFiles[0].buffer);

        await CategoryImage.destroy({ where: { categoryId: category.id } });

        await CategoryImage.create({
          categoryId: category.id,
          file: compressedBuffer.toString('base64'),
        });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await adminCategoryLogic.getCategoryData(id);

      if (!category) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deleted = await adminCategoryLogic.deleteCategoryData(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        return;
      }

      res.json({ success: true, message: 'Categoría eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategoryImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      if (!id ) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos' });
      }

      const deleted = await adminCategoryLogic.deleteCategoryImageData(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      res.json({ success: true, message: 'Imagen eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  },
};

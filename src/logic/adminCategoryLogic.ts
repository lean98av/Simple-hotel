import { SuitCategory, SuitCategoryImage } from '../models';

export default {
    async getAllCategories(): Promise<any[]> {
      return SuitCategory.findAll({ where: { deleted: false } });
    },

    async getCategoryData(id: string): Promise<any | null> {
      const category = await SuitCategory.findByPk(id, {
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1 },
        ],
      });
      return category || null;
    },

    async createCategoryData(
      name: string,
      description: string,
      showToClients: string,
      signPrice: string
    ): Promise<{ category: SuitCategory; files: any[] }> {
      const categoryData = {
        name,
        description,
        showToClients: showToClients === 'true',
        signPrice: parseFloat(signPrice),
        deleted: false,
      };

      const category = await SuitCategory.create(categoryData);
      return { category, files: [] };
    },

    async editCategoryData(
      id: string,
      name: string,
      description: string,
      showToClients: string,
      signPrice: string
    ): Promise<SuitCategory | null> {
      const category = await SuitCategory.findByPk(id);
      if (!category) {
        return null;
      }

      await category.update({
        name,
        description,
        showToClients: showToClients === 'true',
        signPrice: parseFloat(signPrice),
        deleted: false,
      });

      return category;
    },

    async deleteCategoryData(id: string): Promise<boolean> {
      const category = await SuitCategory.findByPk(id);

      if (!category) {
        return false;
      }

      // No permitir eliminar la categoría por defecto
      if (category.id === 1) {
        throw new Error('No se puede eliminar la categoría por defecto.');
      }

      // Eliminar imágenes asociadas a la categoría
      await SuitCategoryImage.destroy({ where: { suitCategoryId: category.id } });

      await category.update({ deleted: true });

      return true;
    },

    async deleteCategoryImageData(id: string): Promise<boolean> {
      const categoryId = parseInt(id);

      const category = await SuitCategory.findByPk(categoryId);
      if (!category) {
        return false;
      }

      await SuitCategoryImage.destroy({ where: { suitCategoryId: categoryId } });

      return true;
    },
};

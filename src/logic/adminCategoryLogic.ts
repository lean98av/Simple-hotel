import Category from '../models/category';
import CategoryImage from '../models/categoryImage';
import Product from '../models/product';

export default {
    async getAllCategories(): Promise<Category[]> {
      return Category.findAll({ where: { deleted: false } });
    },

    async getCategoryData(id: string): Promise<Category | null> {
      const category = await Category.findByPk(id, {
        include: [
          { model: CategoryImage, as: 'images', limit: 1 },
        ],
      });
      return category || null;
    },

    async createCategoryData(
      name: string,
      description: string,
      showToClients: string
    ): Promise<{ category: Category; files: any[] }> {
      const categoryData = {
        name,
        description,
        showToClients: showToClients === 'true',
      };

      const category = await Category.create(categoryData);
      return { category, files: [] };
    },

    async editCategoryData(
      id: string,
      name: string,
      description: string,
      showToClients: string
    ): Promise<Category | null> {
      const category = await Category.findByPk(id);
      if (!category) {
        return null;
      }

      await category.update({
        name,
        description,
        showToClients: showToClients === 'true',
      });

      return category;
    },

    async deleteCategoryData(id: string): Promise<boolean> {
      const category = await Category.findByPk(id);

      if (!category) {
        return false;
      }

      // No permitir eliminar la categoría por defecto
      if (category.id === 1) {
        throw new Error('No se puede eliminar la categoría por defecto.');
      }

      // Reasignar productos asociados a la categoría por defecto (id = 1)
      await Product.update(
        { categoryId: 1 },
        { where: { categoryId: category.id } }
      );

      // Eliminar imágenes asociadas a la categoría
      await CategoryImage.destroy({ where: { categoryId: category.id } });

      await category.update({ deleted: true }, { where: { id: category.id } });

      return true;
    },

    async deleteCategoryImageData(id: string): Promise<boolean> {
      const categoryId = parseInt(id);

      const category = await Category.findByPk(categoryId);
      if (!category) {
        return false;
      }

      await CategoryImage.destroy({ where: { categoryId } });

      return true;
    },
};

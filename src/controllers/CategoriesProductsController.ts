import { Request, Response } from 'express';
import { SuitCategory, SuitCategoryImage, Suit, SuitCategoryImage as SuitCategoryImageModel } from '../models';

export default {
  // Endpoint genérico para AJAX
  async fetchCategoryAndSuites(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.query.categoryId as string);
      const order = (req.query.order as 'ASC' | 'DESC') || 'ASC';
      const page = parseInt(req.query.page as string) || 1;

      const { category, suites } = await fetchCategoryAndSuitesLogic(categoryId, order, page);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
      }

      return res.json({ category, suites, page, order });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Endpoint para obtener solo las categorías en formato JSON
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await SuitCategory.findAll({
        where: { deleted: false, showToClients: true },
        include: [
          { model: SuitCategoryImage, as: 'images', limit: 1 },
        ],
      });

      const allSuitCategories = await SuitCategory.findAll({
        where: {
          deleted: false,
          showToClients: true,
        },
        order: [['signPrice', 'ASC']],
      });

      const categoryIdMap = new Set<number>();
      allSuitCategories.forEach((category) => {
        categoryIdMap.add(category.id);
      });

      // Filtrar categorías que tienen al menos 1 suite
      const categoriesWithSuites = categories.filter((category) =>
        categoryIdMap.has(category.id)
      );

      return res.json({ success: true, categories: categoriesWithSuites });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async renderCategorySuites(req: Request, res: Response) {
    const categoryId = parseInt(req.params.categoryId as string);
    await renderCategory(req, res, categoryId);
  },
};

async function renderCategory(req: Request, res: Response, categoryId: number) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const order = (req.query.order as 'ASC' | 'DESC') || 'ASC';
    const { category, suites } = await fetchCategoryAndSuitesLogic(categoryId, order, page);

    if (!category || !category.showToClients) {
      throw new Error("Categoría no visible para clientes, o no encontrada");
    }

    const categoryData = {
      id: category.id,
      name: category.name,
      description: category.description,
    };

    res.render("categorySuitesList", { suites, page, order, categoryData });
  } catch (error: any) {
    console.error(`Error en renderCategory:`, error);
    res.status(500).render("productionViews/error", { error: error.message });
  }
}

//logica de paginado y ordenamiento
export async function fetchCategoryAndSuitesLogic(
  categoryId: number,
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1
) {
  let category = null;
  if (categoryId) {
    category = await SuitCategory.findByPk(categoryId);
    if (!category) {
      return { category: null, suites: [] };
    }
  }

  const limit = 6;
  const offset = (page - 1) * limit;

  const where: any = {
    deleted: false,
    showToClients: true,
    categoryId: categoryId
  };

  const suites = await Suit.findAll({
    include: [
      { model: SuitCategoryImageModel, as: 'images', limit: 1 },
    ],
    where,
    order: [['number', order]],
    limit,
    offset,
  });

  return { category, suites };
}

import { Request, Response } from 'express';
import Category from '../models/category';
import Product from '../models/product';
import ProductImage from '../models/productImage';
import CategoryImage from '../models/categoryImage';

export default {
  // Endpoint genérico para AJAX
  async fetchCategoryAndProducts(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.query.categoryId as string);
      const order = (req.query.order as 'ASC' | 'DESC') || 'DESC';
      const page = parseInt(req.query.page as string) || 1;

      const { category, products } = await fetchCategoryAndProductsLogic(categoryId, order, page);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
      }

      return res.json({ category, products, page, order });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Endpoint para obtener solo las categorías en formato JSON
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        where: { deleted: false, showToClients: true },
        include: [
          { model: CategoryImage, as: 'images', limit: 1 },
        ],
      });

      const allProducts = await Product.findAll({
        where: {
          deleted: false,
          showToClients: true,
        },
        order: [['price', 'ASC']],
      });

    // Crear mapa de categoryId -> product
    const categoryIdMap = new Set<number>();
    allProducts.forEach((product) => {
      categoryIdMap.add(product.categoryId);
    });

    // Filtrar categorías que tienen al menos 1 producto
    const categoriesWithProducts = categories.filter((category) =>
      categoryIdMap.has(category.id)
    );

      return res.json({ success: true, categories:categoriesWithProducts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async renderCategoryProducts(req: Request, res: Response) {
    const categoryId = parseInt(req.params.categoryId as string);
    await renderCategory(req, res, categoryId);
  },
};

async function renderCategory(req: Request, res: Response, categoryId: number) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const order = (req.query.order as 'ASC' | 'DESC') || 'DESC';
    // Para la categoría 5 (Stock disponible) se aplica un filtro adicional
    const { category, products } = await fetchCategoryAndProductsLogic(categoryId, order, page, categoryId === 5);

    if (!category || !category.showToClients) {
      // En vez de devolver JSON, lanzamos un error para que lo capture el middleware
      throw new Error("Categoría no visible para clientes, o no encontrada");
    }
   const categoryData =  {
      id: category.id,
      name: category.name.toString(),
      description: category.description,
    }
    console.log("Controlador - category:", categoryData);
    res.render("categoryProductsList", { products, page, order, categoryData });
  } catch (error: any) {
    console.error(`Error en renderCategory:`, error);
    // Lanzamos el error para que lo maneje el middleware global
    return res.status(500).render("productionViews/error", { error: error.message });
  }
}

//logica de paginado y ordenamiento
export async function fetchCategoryAndProductsLogic(
  categoryId: number,
  order: 'ASC' | 'DESC' = 'DESC',
  page: number = 1,
  useOutStock: boolean = false
) {
  let category = null;
  if (categoryId) {
    category = await Category.findByPk(categoryId);
    if (!category) {
      return { category: null, products: [] };
    }
  }

  //si el paginado es muy pequeño lo que pasa es que no carga, debemos traer los productos justos como para que los productos oculten un div, con 6 en escritorio funciona bien
  const limit = 6;
  const offset = (page - 1) * limit;

  const where: any = {
    showToClients: true,
    deleted: false,
    categoryId: categoryId
  };

  if (useOutStock) {
    where.outStock = false;
  }

  const products = await Product.findAll({
    include: [
      { model: Category, as: 'category' },
      { model: ProductImage, as: 'images' },
    ],
    where,
    order: [['price', order]],
    limit,
    offset,
  });

  return { category, products };
}

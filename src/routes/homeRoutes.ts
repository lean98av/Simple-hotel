import { Router } from 'express';
import { HomeController } from '../controllers/homeController';
import CategoriesProductsController from '../controllers/categoriesProductsController';

const router = Router();

// Home route
router.get('/', HomeController.home);

// Dynamic category route by ID
router.get('/category/:categoryId', CategoriesProductsController.renderCategoryProducts);

// API endpoint para AJAX
router.get('/fetchCategoryAndProducts', CategoriesProductsController.fetchCategoryAndProducts);

// API endpoint para obtener solo las categorías en formato JSON
router.get('/getCategories', CategoriesProductsController.getCategories);

// FAQ
router.get('/faq', (req, res) => {

    res.render('faq');

});

// CONTACTO
router.get('/contact', (req, res) => {

    res.render('contact');

});

export default router;

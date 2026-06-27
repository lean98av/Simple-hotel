import { Request, Response, NextFunction } from 'express';
import adminOrderLogic from '../logic/adminOrderLogic';

export default {
  async adminOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const statusFilter = req.query.status as string || 'all';

      const data = await adminOrderLogic.getOrdersWithPagination(page, limit, statusFilter);

      res.render('admin/adminOrders', {
        title: 'Admin - Ordenes',
        orders: data.orders,
        statusFilter: data.statusFilter,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  async loadMoreOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const statusFilter = req.query.status as string || 'all';

      const data = await adminOrderLogic.loadMoreOrders(page, limit, statusFilter);

      res.json({
        orders: data.orders,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos: id y status' });
      }

      const updated = await adminOrderLogic.updateOrderData(id, status);

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Orden no encontrada' });
      }

      res.json({ success: true, message: 'Orden actualizada correctamente', data: req.body });
    } catch (error) {
      next(error);
    }
  },
};

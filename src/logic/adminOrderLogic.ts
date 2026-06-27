import Order from '../models/order';
import Product from '../models/product';

export default {
    async getOrdersWithPagination(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      const offset = (page - 1) * limit;

      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalOrders = await Order.count({ where: whereClause });
      const totalPages = Math.ceil(totalOrders / limit);

      const orders = await Order.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      const allProducts = await Product.findAll();
      const productsMap = new Map(allProducts.map((p) => [p.id, p]));

      const enrichedOrders = orders.map((order) => {
        const productIds = order.products.split(',');
        const orderProducts = productIds
          .map((id) => {
            const product = productsMap.get(parseInt(id));
            return product
              ? {
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                }
              : null;
          })
          .filter((p) => p !== null);

        return {
          id: order.id,
          total: order.total,
          products: orderProducts,
          address: order.address,
          clientName: order.clientName,
          clientNotes: order.clientNotes,
          clientPhone: order.clientPhone,
          status: order.status,
          createdAt: order.createdAt,
        };
      });

      return {
        orders: enrichedOrders,
        statusFilter,
        currentPage: page,
        totalPages: totalPages,
      };
    },

    async getOrdersWithoutPagination(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalOrders = await Order.count({ where: whereClause });
      const totalPages = Math.ceil(totalOrders / limit);

      const orders = await Order.findAll({
        where: whereClause,
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
      });

      const allProducts = await Product.findAll();
      const productsMap = new Map(allProducts.map((p) => [p.id, p]));

      const enrichedOrders = orders.map((order) => {
        const productIds = order.products.split(',');
        const orderProducts = productIds
          .map((id) => {
            const product = productsMap.get(parseInt(id));
            return product
              ? {
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                }
              : null;
          })
          .filter((p) => p !== null);

        return {
          id: order.id,
          total: order.total,
          products: orderProducts,
          address: order.address,
          clientName: order.clientName,
          clientNotes: order.clientNotes,
          clientPhone: order.clientPhone,
          status: order.status,
          createdAt: order.createdAt,
        };
      });

      return {
        orders: enrichedOrders,
        statusFilter,
        currentPage: page,
        totalPages: totalPages,
      };
    },

    async loadMoreOrders(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalOrders = await Order.count({ where: whereClause });
      const totalPages = Math.ceil(totalOrders / limit);

      const orders = await Order.findAll({
        where: whereClause,
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
      });

      const allProducts = await Product.findAll();
      const productsMap = new Map(allProducts.map((p) => [p.id, p]));

      const enrichedOrders = orders.map((order) => {
        const productIds = order.products.split(',');
        const orderProducts = productIds
          .map((id) => {
            const product = productsMap.get(parseInt(id));
            return product
              ? {
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                }
              : null;
          })
          .filter((p) => p !== null);

        return {
          id: order.id,
          total: order.total,
          products: orderProducts,
          address: order.address,
          clientName: order.clientName,
          clientNotes: order.clientNotes,
          clientPhone: order.clientPhone,
          status: order.status,
          createdAt: order.createdAt,
        };
      });

      return {
        orders: enrichedOrders,
        currentPage: page,
        totalPages: totalPages,
      };
    },

    async updateOrderData(id: string, status: 'Nuevo' | 'Procesando' | 'Pagado' | 'Enviado' | 'Cancelado'): Promise<boolean> {
      const order = await Order.findByPk(parseInt(id));
      if (!order) {
        return false;
      }

      await order.update({ status });

      return true;
    },
};

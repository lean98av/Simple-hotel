import { Booking, Suit } from '../models';

export default {
    async getBookingsWithPagination(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      const offset = (page - 1) * limit;

      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalBookings = await Booking.count({ where: whereClause });
      const totalPages = Math.ceil(totalBookings / limit);

      const bookings = await Booking.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        include: [
          {
            model: Suit,
            as: 'suit',
            attributes: ['id', 'number', 'status'],
          },
        ],
      });

      const allSuits = await Suit.findAll();
      const suitsMap = new Map(allSuits.map((s) => [s.id, s]));

      const enrichedBookings = bookings.map((booking) => {
        const suit = suitsMap.get(booking.suitId);
        return {
          id: booking.id,
          suitId: booking.suitId,
          suitNumber: suit?.number || 'Sin asignar',
          suitStatus: suit?.status || 'Desconocida',
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          surchargePrice: booking.surchargePrice || 0,
          totalClientPayment: booking.totalClientPayment,
          status: booking.status,
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientNotes: booking.clientNotes,
          createdAt: booking.createdAt,
        };
      });

      return {
        bookings: enrichedBookings,
        currentPage: page,
        totalPages: totalPages,
      };
    },

    async getBookingsWithoutPagination(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalBookings = await Booking.count({ where: whereClause });
      const totalPages = Math.ceil(totalBookings / limit);
      const offset = (page - 1) * limit;

      const bookings = await Booking.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Suit,
            as: 'suit',
            attributes: ['id', 'number', 'status'],
          },
        ],
      });

      const allSuits = await Suit.findAll();
      const suitsMap = new Map(allSuits.map((s) => [s.id, s]));

      const enrichedBookings = bookings.map((booking) => {
        const suit = suitsMap.get(booking.suitId);
        return {
          id: booking.id,
          suitId: booking.suitId,
          suitNumber: suit?.number || 'Sin asignar',
          suitStatus: suit?.status || 'Desconocida',
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          surchargePrice: booking.surchargePrice || 0,
          totalClientPayment: booking.totalClientPayment,
          status: booking.status,
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientNotes: booking.clientNotes,
          createdAt: booking.createdAt,
        };
      });

      return {
        bookings: enrichedBookings,
        totalPages,
      };
    },

    async loadMoreBookings(
      page: number,
      limit: number,
      statusFilter?: string
    ): Promise<any> {
      let whereClause: any = {};
      if (statusFilter !== 'all') {
        whereClause.status = statusFilter;
      }

      const totalBookings = await Booking.count({ where: whereClause });
      const totalPages = Math.ceil(totalBookings / limit);
      const offset = (page - 1) * limit;

      const bookings = await Booking.findAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Suit,
            as: 'suit',
            attributes: ['id', 'number', 'status'],
          },
        ],
      });

      const allSuits = await Suit.findAll();
      const suitsMap = new Map(allSuits.map((s) => [s.id, s]));

      const enrichedBookings = bookings.map((booking) => {
        const suit = suitsMap.get(booking.suitId);
        return {
          id: booking.id,
          suitId: booking.suitId,
          suitNumber: suit?.number || 'Sin asignar',
          suitStatus: suit?.status || 'Desconocida',
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          surchargePrice: booking.surchargePrice || 0,
          totalClientPayment: booking.totalClientPayment,
          status: booking.status,
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientNotes: booking.clientNotes,
          createdAt: booking.createdAt,
        };
      });

      return {
        bookings: enrichedBookings,
        currentPage: page,
        totalPages: totalPages,
      };
    },

    async updateBookingStatus(id: string, status: string): Promise<boolean> {
      const booking = await Booking.findByPk(parseInt(id));
      if (!booking) {
        return false;
      }

      await booking.update({ status: status as any });

      return true;
    },
};

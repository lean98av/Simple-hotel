import Booking from '../models/booking';
import Suit from '../models/suit';
import SuitCategory from '../models/suitCategory';
import { Op } from 'sequelize';

export type BookingStatus = 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada' | 'Cancelada';

export default {
  async getBookingsWithPagination(
    page: number,
    limit: number,
    statusFilter?: string
  ): Promise<{ bookings: any[]; totalPages: number; currentPage: number }> {
    let whereClause: any = {};
    if (statusFilter !== 'all') {
      whereClause.status = statusFilter;
    }

    const totalBookings = await Booking.count({ where: whereClause });
    const totalPages = Math.ceil(totalBookings / limit);
    const offset = (page - 1) * limit;

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
  ): Promise<{ bookings: any[]; totalPages: number }> {
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
  ): Promise<{ bookings: any[]; currentPage: number; totalPages: number }> {
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

  async updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    const booking = await Booking.findByPk(parseInt(id));
    if (!booking) {
      return false;
    }

    await booking.update({ status });
    return true;
  },

  async createBookingData(
    suitId: string,
    startDate: string,
    endDate: string,
    totalPrice: number,
    surchargePrice: number | null,
    totalClientPayment: number,
    status: BookingStatus,
    clientName: string,
    clientPhone: string,
    clientNotes: string
  ): Promise<{ booking: Booking; files: any[] }> {
    const bookingData = {
      suitId: parseInt(suitId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      surchargePrice: surchargePrice === null ? 0 : surchargePrice,
      totalClientPayment,
      status,
      clientName,
      clientPhone,
      clientNotes,
    };

    const booking = await Booking.create(bookingData);
    return { booking, files: [] };
  },

  async getSuitBookings(suitId: number): Promise<Booking[]> {
    return Booking.findAll({
      where: { suitId },
      order: [['startDate', 'ASC']],
    });
  },

  async checkSuitAvailability(suitId: number, startDate: Date, endDate: Date): Promise<boolean> {
    const conflicts = await Booking.findAll({
      where: {
        suitId,
        status: {
          [Op.notIn]: ['Cancelada'],
        },
      },
    });

    return conflicts.length === 0;
  },
};

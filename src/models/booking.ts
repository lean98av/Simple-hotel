import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import Suit from './suit';

export type BookingStatus = 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada' | 'Cancelada';

export interface BookingAttributes {
  id: number;
  suitId: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  surchargePrice: number;
  totalClientPayment: number;
  status: BookingStatus;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCreationAttrs {
  suitId: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  surchargePrice?: number;
  totalClientPayment: number;
  status: BookingStatus;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
}

class Booking extends Model<BookingAttributes, BookingCreationAttrs> {
  public id!: number;
  public suitId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public totalPrice!: number;
  public surchargePrice!: number;
  public totalClientPayment!: number;
  public status!: BookingStatus;
  public clientName!: string;
  public clientPhone!: string;
  public clientNotes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    suitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suits',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    surchargePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalClientPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('Pendiente', 'Confirmada', 'En curso', 'Finalizada', 'Cancelada'),
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    clientName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    clientPhone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    clientNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['startDate'],
      },
      {
        fields: ['endDate'],
      },
      {
        fields: ['suitId'],
      },
    ],
  }
);

// Definir relación después de exportar el modelo
// Booking.belongsTo(Suit, {
//   foreignKey: 'suitId',
//   as: 'bookings',
// });

export default Booking;

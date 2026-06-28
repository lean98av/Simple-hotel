import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import SuitCategory from './suitCategory';
import Booking from './booking';

export type SuitStatus = 'disponible' | 'no disponible' | 'en mantenimiento' | 'en limpieza' | 'ocupada';

export interface SuitAttributes {
  id: number;
  number: string;
  status: SuitStatus;
  deleted: boolean;
  suitCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuitCreationAttrs {
  number: string;
  status: SuitStatus;
  deleted: boolean;
}

class Suit extends Model<SuitAttributes, SuitCreationAttrs> {
  public id!: number;
  public number!: string;
  public status!: SuitStatus;
  public deleted!: boolean;
  public suitCategoryId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Suit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('disponible', 'no disponible', 'en mantenimiento', 'en limpieza', 'ocupada'),
      allowNull: false,
      defaultValue: 'disponible',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    suitCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suit_categories',
        key: 'id',
      },
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
    tableName: 'suits',
    timestamps: true,
    indexes: [
      {
        fields: ['deleted'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['number'],
      },
      {
        fields: ['suitCategoryId'],
      },
    ],
  }
);

// Definir relaciones después de exportar el modelo
Suit.belongsTo(SuitCategory, {
  foreignKey: 'suitCategoryId',
  as: 'category',
});

Suit.hasMany(Booking, {
  foreignKey: 'suitId',
  as: 'bookings',
});

export default Suit;

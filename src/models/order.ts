import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import Product from './product';
import OrderProduct from './orderProduct';

export interface OrderAttributes {
  id: number;
  total: number;
  products: string;
  address: string;
  clientName: string;
  clientNotes: string;
  clientPhone: string;
  status: 'Nuevo' | 'Procesando'| 'Pagado' | 'Enviado' |'Cancelado';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreationAttrs extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  total: number;
  products: string;
  clientPhone: string;
  status: 'Nuevo' | 'Procesando'| 'Pagado' | 'Enviado' |'Cancelado';
}

export class Order
  extends Model<OrderAttributes, OrderCreationAttrs>
  implements OrderAttributes {
  public id!: number;
  public total!: number;
  public products!: string;
  public address!: string;
  public clientName!: string;
  public clientNotes!: string;
  public clientPhone!: string;
  public status!: 'Nuevo' | 'Procesando'| 'Pagado' | 'Enviado' |'Cancelado';
  public createdAt!: Date;
  public updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    products: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientNotes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Nuevo', 'Procesando', 'Pagado', 'Enviado', 'Cancelado'),
      allowNull: false,
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
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default Order;

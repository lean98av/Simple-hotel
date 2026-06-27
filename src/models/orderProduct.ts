import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

export interface OrderProductAttributes {
  id: number;
  productId: number;
  orderId: number;
}

export interface OrderProductCreationAttrs extends Optional<OrderProductAttributes, 'id'> {}

declare global {
  namespace sequelize {
    interface ModelStatic {
      OrderProduct: Model<OrderProductAttributes, OrderProductCreationAttrs>;
    }
  }
}

export class OrderProduct extends Model<OrderProductAttributes, OrderProductCreationAttrs> implements OrderProductAttributes {
  public id!: number;
  public productId!: number;
  public orderId!: number;
}

OrderProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order_products',
    timestamps: false,
    indexes: [
      {
        fields: ['productId'],
      },
      {
        fields: ['orderId'],
      },
    ],
  }
);

export default OrderProduct;

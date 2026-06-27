import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import type Product from './product';

export interface ProductImageAttributes {
  id: number;
  productId?: number;
  name: string;
  file: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImageCreationAttrs extends Optional<ProductImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  order: number;
}

class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttrs> {
  public id!: number;
  public productId!: number;
  public name!: string;
  public file!: string;
  public order!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING(2097152),
      allowNull: false,
      validate: {
        len: [0, 2097152], // Base64 string max length for 2MB
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 4,
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
    tableName: 'product_images',
    timestamps: true,
    indexes: [
      {
        fields: ['productId'],
      },
    ],
  }
);

export default ProductImage;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import Category from './category';
import ProductImage from './productImage';

export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  showToClients: boolean;
  outStock: boolean;
  deleted: boolean;
  topProduct: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreationAttrs extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  showToClients: boolean;
  outStock: boolean;
  topProduct: boolean;
  order?: number;
  id?: undefined;
  createdAt?: undefined;
  updatedAt?: undefined;
}

class Product extends Model<ProductAttributes, ProductCreationAttrs> {
  public id!: number;
  public name!: string;
  public price!: number;
  public description?: string;
  public categoryId!: number;
  public showToClients!: boolean;
  public outStock!: boolean;
  public deleted!: boolean;
  public topProduct!: boolean;
  public order?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    showToClients: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    outStock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    topProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        fields: ['showToClients'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['deleted'],
      },
      {
        fields: ['topProduct'],
      },
    ],
  }
);

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Product.hasMany(ProductImage, {
  foreignKey: 'productId',
  as: 'images',
});

ProductImage.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

export default Product;

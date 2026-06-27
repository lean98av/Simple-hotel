import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import CategoryImage from './categoryImage';

export interface CategoryAttributes {
  id?: number;
  name: string;
  description?: string;
  deleted?: boolean;
  showToClients?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryCreationAttrs extends Omit<CategoryAttributes, 'id'> {
  id?: number;
}

export class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public deleted?: boolean;
  public showToClients?: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    showToClients: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);

Category.hasMany(CategoryImage, {
  foreignKey: 'categoryId',
  as: 'images',
});

CategoryImage.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

export default Category;

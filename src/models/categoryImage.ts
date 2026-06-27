import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import type Category from './category';

export interface CategoryImageAttributes {
  id?: number;
  categoryId?: number;
  file: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryImageCreationAttrs = Optional<CategoryImageAttributes, 'id'>;



class CategoryImage extends Model<CategoryImageAttributes> {
  public id!: number;
  public categoryId!: number;
  public file!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

CategoryImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    file: {
      type: DataTypes.STRING(2097152),
      allowNull: false,
      validate: {
        len: [0, 2097152], // Base64 string max length for 2MB
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
    tableName: 'category_images',
    timestamps: true,
    indexes: [
      {
        fields: ['categoryId'],
      },
    ],
  }
);

export default CategoryImage;

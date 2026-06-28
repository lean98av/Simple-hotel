import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import Suit from './suit';
import SuitCategoryImage from './suitCategoryImage';

export interface SuitCategoryAttributes {
  id: number;
  name: string;
  description?: string;
  signPrice: number;
  showToClients: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuitCategoryCreationAttrs {
  name: string;
  description?: string;
  signPrice: number;
  showToClients: boolean;
  deleted: boolean;
}

class SuitCategory extends Model<SuitCategoryAttributes, SuitCategoryCreationAttrs> {
  public id!: number;
  public name!: string;
  public description?: string;
  public signPrice!: number;
  public showToClients!: boolean;
  public deleted!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

SuitCategory.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    showToClients: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deleted: {
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
    tableName: 'suit_categories',
    timestamps: true,
    indexes: [
      {
        fields: ['deleted'],
      },
      {
        fields: ['signPrice'],
      },
    ],
  }
);

SuitCategory.hasMany(SuitCategoryImage, {
  foreignKey: 'suitCategoryId',
  as: 'images',
});

SuitCategory.belongsTo(Suit, {
  foreignKey: 'suitId',
  as: 'suits',
});

export default SuitCategory;

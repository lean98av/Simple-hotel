import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import AnnouncementImage from './announcementImage';

export interface AnnouncementAttributes {
  id?: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnnouncementCreationAttrs extends Omit<AnnouncementAttributes, 'id'> {
  id?: number;
}

export class Announcement extends Model<AnnouncementAttributes> implements AnnouncementAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public startDate?: Date;
  public endDate?: Date;
  public deleted?: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Announcement.init(
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    tableName: 'announcements',
    timestamps: true,
  }
);

Announcement.hasMany(AnnouncementImage, {
  foreignKey: 'announcementId',
  as: 'images',
});

AnnouncementImage.belongsTo(Announcement, {
  foreignKey: 'announcementId',
  as: 'announcement',
});

export default Announcement;

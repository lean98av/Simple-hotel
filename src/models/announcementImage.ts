import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import type Announcement from './announcement';

export interface AnnouncementImageAttributes {
  id?: number;
  announcementId?: number;
  file: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AnnouncementImageCreationAttrs = Optional<AnnouncementImageAttributes, 'id'>;



class AnnouncementImage extends Model<AnnouncementImageAttributes> {
  public id!: number;
  public announcementId!: number;
  public file!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

AnnouncementImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    announcementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'announcements',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    file: {
      type: DataTypes.BLOB,
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
    tableName: 'announcement_images',
    timestamps: true,
    indexes: [
      {
        fields: ['announcementId'],
      },
    ],
  }
);

export default AnnouncementImage;

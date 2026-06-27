import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

export interface UserAttributes {
  id: number;
  userName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttrs extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  usernName: string;
  password: string;
}

export class User extends Model<UserAttributes, UserCreationAttrs> implements UserAttributes {
  public id!: number;
  public userName!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
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
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

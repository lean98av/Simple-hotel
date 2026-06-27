import {
    DataTypes,
    Model,
    Optional
} from "sequelize";

import sequelize from '../config/db';

interface SettingAttributes {

    id: number;

    key: string;

    value: string;
}

interface SettingCreationAttributes
    extends Optional<SettingAttributes, "id"> { }

class Setting
    extends Model<
        SettingAttributes,
        SettingCreationAttributes
    >
    implements SettingAttributes {

    public id!: number;

    public key!: string;

    public value!: string;
}

Setting.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    value: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {

    sequelize,

    modelName: "Setting",

    tableName: "Settings"
});

export default Setting;
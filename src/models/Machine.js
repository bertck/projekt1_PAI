import { DataTypes, Model } from "sequelize";
import sequelize from '../db/index.js';

class Machine extends Model { }

Machine.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, validate: { len: [5, 20] } },
        description: { type: DataTypes.TEXT, validate: { len: [0, 100] } },
    },
    { sequelize, modelName: 'Machine', tableName: 'machines' }
);

export default Machine;
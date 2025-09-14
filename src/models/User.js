import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js"

class User extends Model {}

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
        username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { len: [3, 20] } },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    },
    { sequelize, modelName: 'User', tableName: 'users' }
);

export default User;
import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../db/index.js";
import Machine from "./Machine.js";
import User from "./User.js";

class Reservation extends Model { }

Reservation.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        startDate: { type: DataTypes.DATEONLY, allowNull: false },
        endDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
        sequelize,
        modelName: 'Reservation',
        tableName: 'reservations',
        validate: {
            startBeforeEnd() {
                if (this.startDate > this.endDate) {
                    throw new Error('start after end');
                }
                const start = new Date(this.startDate);
                const end = new Date(this.endDate);
                const max = new Date();
                max.setMonth(max.getMonth() + 3);
                if (start > max || end > max) {
                    throw new Error('date too far');
                }
            }
        }
    }
);



// Relacje
User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

Machine.hasMany(Reservation, { foreignKey: 'machineId', onDelete: 'CASCADE' });
Reservation.belongsTo(Machine, { foreignKey: 'machineId', onDelete: 'CASCADE' });

export default Reservation;
export { Op };
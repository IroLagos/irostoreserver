'use strict';


const {Model, UUIDV4} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Payment extends Model{
   
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

 
    static associate(models) {
      // define association here
//       Booking.hasOne(models.Payment, {
//         foreignKey: 'bookingId',
//         as: 'Payment'
//       }
//   ),
//   Booking.hasOne(models.User, {
//     foreignKey: 'bookingId',
//     as: 'User'
//   }
// )
    }
  }
  Payment.init({
    transactionRefId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true
    },
      amount: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
      bookingId: {
            type: DataTypes.STRING,
            allowNull: false
          },
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};
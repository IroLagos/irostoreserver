'use strict';

const { Model, UUIDV4 } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   Customer.hasMany(models.Review, { foreignKey: 'CustomerId' });
      Customer.hasMany(models.Purchase, { foreignKey: 'customerId' });
    }
  }

  Customer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  }, {
    sequelize,
    modelName: 'Customer',
  });

  return Customer;
};
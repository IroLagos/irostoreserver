'use strict';


const {Model, UUIDV4} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class Sub extends Model{
   
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

 
    static associate(models) {
      // define association here

   Sub.hasMany(models.Product, {
     foreignKey: 'subId',
     as: 'Subcategory'
   }
 )
    }
  }
  Sub.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    // imageUrl: {
    //       type: DataTypes.STRING,
    //       allowNull: true
    //     },

  }, {
    sequelize,
    modelName: 'Sub',
  });
  return Sub;
};
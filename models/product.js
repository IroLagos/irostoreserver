'use strict';


const {Model, UUIDV4} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Product extends Model{
   
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

 
    static associate(models) {
      // define association here
      Product.hasMany(models.Review, { foreignKey: 'productId', as:'Review' });
      Product.hasMany(models.Purchase, { foreignKey: 'productId', as:'Purchase' });
      Product.belongsTo(models.Category, {foreignKey:'categoryId', as:'Category'})
      Product.belongsTo(models.Sub, {foreignKey:'subId', as:'Subcategory'})
      Product.belongsTo(models.Subsub, {foreignKey:'subsubId', as:'Subsubcategory'})
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
    heading: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      description: {
          type: DataTypes.STRING,
          allowNull: false
        },
      imageUrls: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true
        },
      color: {
          type: DataTypes.STRING,
          allowNull: true
        },
      size: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true
        },
      sub: {
          type: DataTypes.STRING,
          allowNull: true
        },
      subsub: {
          type: DataTypes.STRING,
          allowNull: true
        },
      brand: {
          type: DataTypes.STRING,
          allowNull: true
        },
      availability: {
          type: DataTypes.STRING,
          allowNull: true
        },
      counter: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
      categoryId: {
          type: DataTypes.UUID,
          // defaultValue: UUIDV4,
          allowNull: true,
        },


  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
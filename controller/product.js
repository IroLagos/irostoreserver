const { Request, Response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { uploadtocloudinary, uploadType } = require("../middleware/cloudinary");
const db = require("../models");
const { totalmem } = require("os");
const { Product, Review, Purchase, Category } = db;
const { Op } = require('sequelize');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

	// const create = async (req, res) => {
	// 	try {

	// 		const {title, heading, availability, price, discount, description, color, size, sub, brand } = req.body;

	// 		let imageUrls = [];
	// 		if (req.file && req.files.length > 0) {
	// 			for (let file of req.files){
	// 				const uploadResult = await uploadtocloudinary(file.buffer);
	// 				if (uploadResult.message === "error"){
	// 					throw new Error(uploadResult.error.message);
	// 				}
	// 				imageUrls.push(uploadResult.url);
	// 			}
	// 		}

	// 		// create Product record in the database
	// 		const record = await Product.create({ ...req.body, imageUrls: imageUrls });
	// 		return res.status(200).json({ record, msg: "Successfully create Product" });
	// 	} catch (error) {
	// 		console.log("henry", error);
	// 		return res.status(500).json({ msg: "fail to create", error });
	// 	}
	// }
	const create = async (req, res) => {
		try {
		  const { title, heading, availability, price, discount, description, color, size, sub, brand } = req.body;
	  
		  let imageUrls = [];
		  if (req.file && req.files.length > 0) {
			for (let file of req.files) {
			  const uploadResult = await uploadtocloudinary(file.buffer);
			  if (uploadResult.message === "error") {
				throw new Error(uploadResult.error.message);
			  }
			  imageUrls.push(uploadResult.url);
			}
		  }
	  
		  // Get the highest position
		  const highestPosition = await Product.max('position');
	  
		  // Create Product record in the database with the next position
		  const record = await Product.create({ 
			...req.body, 
			imageUrls: imageUrls,
			position: (highestPosition || 0) + 1 
		  });
	  
		  return res.status(200).json({ record, msg: "Successfully create Product" });
		} catch (error) {
		  console.log("henry", error);
		  return res.status(500).json({ msg: "fail to create", error });
		}
	  }

	const readall = async (req, res) => {
		try {

			const {title} = req.query;

			let whereClause = {};

			if(title){
				whereClause.title = {
					[Op.iLike]: `%${title}%`
				};
			}

			const records = await Product.findAll({
				where: whereClause,
				include:[{model:Purchase, as: 'Purchase'},{model:Review, as: 'Review'},{model:Category, as:'Category'}],
				order:[['createdAt', 'DESC']]
			});
			return res.json(records);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read" });
		}
	}



	const readId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Product.findOne({ where: { id } });
			return res.json(record);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/:id" });
		}
	}

	const readByUserId = async (req, res) => {
		try {
			const { userId } = req.params;
			const products = await Product.findAll({ where: { user: userId } });
			return res.json(products);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/user/:userId" });
		}
	}

	// const update = async (req, res) => {
	// 	try {
	// 		const { title, heading, availability, price, discount, description, color, size,sub,brand, categoryId } = req.body;
			
	// 		// Prepare update object with only the fields that should be updated
	// 		const updateData = {};
	// 		if (title !== undefined) updateData.title = title;
	// 		if (heading !== undefined) updateData.heading = heading;
	// 		if (availability !== undefined) updateData.availability = availability;
	// 		if (price !== undefined) updateData.price = price;
	// 		if (discount !== undefined) updateData.discount = discount;
	// 		if (description !== undefined) updateData.description = description;
	// 		if (color !== undefined) updateData.color = color;
	// 		if (size !== undefined) updateData.size = size;
	// 		if (sub !== undefined) updateData.sub = sub;
	// 		if (brand !== undefined) updateData.brand = brand;
	// 		if (categoryId !== undefined) updateData.categoryId = categoryId;

	// 		if (req.files && req.files.length > 0) {
	// 			let imageUrls = [];
	// 			for (let file of req.files) {
	// 			  const uploadResult = await uploadtocloudinary(file.buffer);
	// 			  if (uploadResult.message === "error") {
	// 				throw new Error(uploadResult.error.message);
	// 			  }
	// 			  imageUrls.push(uploadResult.url);
	// 			}
	// 			updateData.imageUrls = imageUrls;
	// 		  }
	
	// 		// Update the product with only the fields that were provided
	// 		const [updated] = await Product.update(updateData, { where: { id: req.params.id } });
			
	// 		if (updated) {
	// 			const updatedProduct = await Product.findByPk(req.params.id);
	// 			res.status(200).json(updatedProduct);
	// 		} else {
	// 			res.status(404).json({ message: 'Product not found' });
	// 		}
	// 	} catch (error) {
	// 		res.status(500).json({ message: 'Error updating the Product', error: error.message });
	// 	}
	// }
	const update = async (req, res) => {
		try {
		  const { title, heading, availability, price, discount, description, color, size, sub, brand, categoryId } = req.body;
		  
		  // Prepare update object with only the fields that should be updated
		  const updateData = {};
		  if (title !== undefined) updateData.title = title;
		  if (heading !== undefined) updateData.heading = heading;
		  if (availability !== undefined) updateData.availability = availability;
		  if (price !== undefined) updateData.price = price;
		  if (discount !== undefined) updateData.discount = discount;
		  if (description !== undefined) updateData.description = description;
		  if (color !== undefined) updateData.color = color;
		  if (size !== undefined) updateData.size = size;
		  if (sub !== undefined) updateData.sub = sub;
		  if (brand !== undefined) updateData.brand = brand;
		  if (categoryId !== undefined) updateData.categoryId = categoryId;
	  
		  if (req.files && req.files.length > 0) {
			let imageUrls = [];
			for (let file of req.files) {
			  const uploadResult = await uploadtocloudinary(file.buffer);
			  if (uploadResult.message === "error") {
				throw new Error(uploadResult.error.message);
			  }
			  imageUrls.push(uploadResult.url);
			}
			updateData.imageUrls = imageUrls;
		  }
	  
		  // Update the product with only the fields that were provided
		  const [updated] = await Product.update(updateData, { where: { id: req.params.id } });
		  
		  if (updated) {
			const updatedProduct = await Product.findByPk(req.params.id);
			res.status(200).json(updatedProduct);
		  } else {
			res.status(404).json({ message: 'Product not found' });
		  }
		} catch (error) {
		  res.status(500).json({ message: 'Error updating the Product', error: error.message });
		}
	  }

	const deleteId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Product.findOne({ where: { id } });

			if (!record) {
				return res.json({ msg: "Can not find existing record" });
			}

			const deletedRecord = await record.destroy();
			return res.json({ record: deletedRecord });
		} catch (e) {
			return res.json({
				msg: "fail to read",
				status: 500,
				route: "/delete/:id",
			});
		}
	}


module.exports = {create, readall, readId, update, deleteId, readByUserId};
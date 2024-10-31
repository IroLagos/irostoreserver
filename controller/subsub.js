const { Request, Response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const db = require("../models");
const { totalmem } = require("os");
const { Subsub} = db;
const { Op } = require('sequelize');


	const create = async (req, res) => {
		try {

			const {name} = req.body;

			
			// create Subsub record in the database
			const record = await Subsub.create({ ...req.body});
			return res.status(200).json({ record, msg: "Successfully create Subsub" });
		} catch (error) {
			console.log("henry", error);
			return res.status(500).json({ msg: "fail to create", error });
		}
	}

	const readall = async (req, res) => {
		try {
			const limit = req.query.limit || 10;
			const offset = req.query.offset;

			const records = await Subsub.findAll({
				// include:[{model:Payment, as: 'Payment'},{model:User, as: 'User'}]
                // include:{model:Product, as: 'Product'}
			});
			return res.json(records);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read" });
		}
	}

	const readId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Subsub.findOne({ where: { id },
				include:{model:Product, as: 'Product'}
			});
			return res.json(record);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/:id" });
		}
	}

	const readByUserId = async (req, res) => {
		try {
			const { userId } = req.params;
			const communities = await Subsub.findAll({ where: { user: userId } });
			return res.json(communities);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/user/:userId" });
		}
	}

	const update = async (req, res) => {
		try {
			const {name} = req.body;

			// Prepare update object with only the fields that should be updated
			const updateData = {};
			if(name !== undefined) updateData.name = name;

			// check if image was uploaded
			if(req.file){
				console.log(req.file);
				// Upload image to Cloudinary
				const uploadresult = await uploadtocloudinary(req.file.buffer);
				if(uploadresult.message === "error"){
					throw new Error(uploadresult.error.message);
				}
				updateData.imageUrl = uploadresult.url;
			}

		// Update the product with only the fields that were provided
			const [updated] = await Subsub.update(updateData, { where: { id: req.params.id } });

			if (updated) {
				const updatedSubsub = await Subsub.findByPk(req.params.id);
				res.status(200).json(updatedSubsub);
			} else {
				res.status(404).json({ message: 'Subsub not found' });
			}
		} catch (error) {
			res.status(500).json({ message: 'Error updating the Subsub', error });
		}
	}

	const deleteId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Subsub.findOne({ where: { id } });

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
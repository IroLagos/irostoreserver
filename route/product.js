const express = require('express');

const {create, readall, readId, update, deleteId} = require('../controller/product')

const multer = require('multer');


const router = express.Router();

// set up multer storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({storage});



router.post(
	'/create',
    // verifyToken,
    upload.array('imageUrl', 10), // allow up to 10 images
    create
);

router.get(
    '/',
    readall
);
router.get(
	'/:id',
    // verifyToken,
    readId
);
router.put(
    '/:id',
    upload.array('imageUrl', 10),
    update
);
router.delete(
    '/:id',
    // verifyToken,
    deleteId
);


module.exports = router;
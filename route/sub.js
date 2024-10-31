const express = require('express');

const {create, readall, readId, update, deleteId} = require('../controller/sub')

const router = express.Router();

router.post(
	'/create',
    create
);

router.get(
    '/',
    readall
);
router.get(
	'/:id',
    readId
);
router.put(
    '/:id',
    update
);
router.delete(
    '/:id',
    deleteId
);


module.exports = router;
const router = require('express').Router();
const { pool } = require('../util/db');
const { QUERIES, CODES } = require('../util/constants');

router.get('/all', async (_, res) => {
	try {
		console.log('Getting cuisines');
		const client = await pool.connect();
		const dbRes = await client.query(QUERIES.selectAllCuisines);
		res.status(200).json(dbRes.rows);
		client.release();
	} catch (error) {
		console.log('Cuisines Get Error:', error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: 'Unable to get all cuisines',
			error: error.message,
		});
	}
});

router.post('/', async (req, res) => {
	try {
		console.log('Inserting Cuisine');
		const client = await pool.connect();
		await client.query(QUERIES.insertCuisine, [req.body.cuisine]);
		client.release();
		res.status(200).json({ status: CODES.SUCCESS });
	} catch (error) {
		console.log('Cuisine Insert Error: ' + error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: `Unable to insert cuisine ${req.params.id}`,
			error: error.message,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		console.log('Deleting Cuisine');
		const client = await pool.connect();
		await client.query(QUERIES.deleteCuisine, [req.params.id]);
		client.release();
		res.status(200).json({ status: CODES.SUCCESS });
	} catch (error) {
		console.log('Cuisine Delete Error: ' + error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: `Unable to delete cuisine ${req.params.id}`,
			error: error.message,
		});
	}
});

module.exports = router;

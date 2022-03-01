const router = require('express').Router();
const { pool } = require('../util/db');
const { QUERIES, CODES } = require('../util/constants');

router.get('/', async (_, res) => {
	try {
		console.log('Getting recipes');
		const client = await pool.connect();
		const dbRes = await client.query(QUERIES.selectAllRecipes);
		res.status(200).json(dbRes.rows);
		client.release();
	} catch (error) {
		console.log('Recipes Get Error:', error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: 'Unable to get all recipes',
			error: error.message,
		});
	}
});

router.get('/detail/:id', async (req, res) => {
	try {
		console.log('Getting Recipe Detail', req.params.id);
		const client = await pool.connect();
		const dbRes = await client.query(QUERIES.selectRecipeDetail, [req.params.id]);
		res.status(200).json(dbRes.rows);
		client.release();
	} catch (error) {
		console.log('Recipe Detail Get Error:', error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: 'Unable to get recipe details',
			error: error.message,
		});
	}
});

router.post('/', async (req, res) => {
	try {
		console.log('Inserting Recipe');
		const client = await pool.connect();
		const insertRes = await client.query(QUERIES.insertRecipe, [
			req.body.title,
			req.body.description,
			req.body.cuisine,
			req.body.duration,
		]);
		await client.query(QUERIES.insertRecipeDetail, [
			insertRes.rows[0].id,
			req.body.steps,
			req.body.ingredients,
			req.body.tags,
		]);
		client.release();
		res.status(200).json({ status: CODES.SUCCESS, insertedId: insertRes.rows[0].id });
	} catch (error) {
		console.log('Recipe Insert Error: ' + error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: 'Unable to insert recipe',
			error: error.message,
		});
	}
});

router.post('/:id', async (req, res) => {
	try {
		console.log('Updating Recipe', req.params.id);
		const client = await pool.connect();
		await client.query(QUERIES.updateRecipe, [
			req.body.title,
			req.body.description,
			req.body.cuisine,
			req.body.duration,
			req.params.id,
		]);
		await client.query(QUERIES.updateRecipeDetail, [
			req.body.steps,
			req.body.ingredients,
			req.body.tags,
			req.params.id,
		]);
		client.release();
		res.status(200).json({ status: CODES.SUCCESS });
	} catch (error) {
		console.log('Recipe Update Error: ' + error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: `Unable to update recipe ${req.params.id}`,
			error: error.message,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		console.log('Deleting Recipe', req.params.id);
		const client = await pool.connect();
		await client.query(QUERIES.deleteRecipe, [req.params.id]);
		client.release();
		res.status(200).json({ status: CODES.SUCCESS });
	} catch (error) {
		console.log('Recipe Delete Error: ' + error.message);
		res.status(500).json({
			status: CODES.INTERNAL_SERVER_ERR,
			message: `Unable to delete recipe ${req.params.id}`,
			error: error.message,
		});
	}
});

module.exports = router;

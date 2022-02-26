const { Pool } = require('pg');
const { DATABASE_URL, QUERIES } = require('./constants');

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const initDB = async () => {
	try {
		console.log('Creating Tables for initial DB State');
		const client = await pool.connect();
		await client.query(QUERIES.create);
		client.release();
	} catch (error) {
		console.log('Unable to create tables', error.message);
	}
};

module.exports = { pool, initDB };

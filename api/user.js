const router = require('express').Router();
const { CODES } = require('../util/constants');

router.post('/login', async (req, res) => {
	if (req.body.username === 'harinakshi' && req.body.password === 'harina2971') {
		res.status(200).json({ status: CODES.SUCCESS });
	} else {
		res.status(401).json({ status: CODES.UNAUTHORIZED });
	}
});

module.exports = router;

const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');

const { PORT } = require('./util/constants');
const { shouldCompress } = require('./util/utility');
const { initDB } = require('./util/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression({ filter: shouldCompress }));

const userAPI = require('./api/user');
const cuisineAPI = require('./api/cuisines');
const recipeAPI = require('./api/recipes');

initDB();

app.use('/user', userAPI);
app.use('/recipes', recipeAPI);
app.use('/cuisines', cuisineAPI);

// app.use(express.static(__dirname + '/public/'));
app.get('/status', (_, res) => {
	res.status(200).send('mom-cookbook-server-1.0 is UP');
});

app.get(/.*/, function (_, res) {
	res.status(404).sendFile(__dirname + '/public/pagenotfound.html');
});

app.listen(PORT, () => {
	console.log('Listening on port', PORT);
});

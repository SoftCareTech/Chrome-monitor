const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(bodyParser.json());

const connectionString = 'mongodb://localhost:27017';
MongoClient.connect(
	connectionString,
	{
		useUnifiedTopology: true,
	},
	(err, client) => {
		if (err) return console.error(err);
		console.log('Connected to Database');

		const db = client.db('chrome_monitor');
		const collection = db.collection('site_rate');

		app.get('/view_analysis', (req, res) => {
			collection
				.aggregate([
					{
						$group: {
							_id: { host: '$host' },
							keyPressed: { $sum: '$keyPressed' },
							scroll: { $sum: '$scroll' },
							duration: { $sum: '$duration' },
							clicked: { $sum: '$clicked' },

							host: { $first: '$host' },
						},
					},
				])
				.toArray()
				.then((results) => {
					res.render('index.ejs', { obj: results });
				})
				.catch((error) => console.error(error));
			console.log(req.body);
		});

		app.get('/analyse/:url', (req, res) => {
			var url = req.params.url;
			collection
				.find({ host: url })
				.toArray()
				.then((results) => {
					res.render('analyse.ejs', { obj: results });
				})
				.catch((error) => console.error(error));
			console.log(req.body);
		});

		app.post('/test', (req, res) => {
			console.log('testing');
			console.log(req.body);
			collection
				.findOneAndUpdate(
					{ page: req.body.page },
					{
						$set: {
							host: req.body.host,
							page: req.body.page,
						},
						$inc: {
							clicked: req.body.clicked,
							keyPressed: req.body.keyPressed,
							scroll: req.body.scrol,
							duration: req.body.duration,
						},
					},
					{
						upsert: true,
					},
				)
				.then((result) => {
					console.log('result');
					console.log(result);
				})
				.catch((error) => console.error(error));

			res.json('h11');
		});
		app.get('/*', (req, res) => {
			res.redirect('/view_analysis');
		});
	},
);

module.exports = app;

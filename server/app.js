const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
var cors = require('cors');
const { json } = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());

const connectionString = 'mongodb://localhost:27017';
MongoClient.connect(
    connectionString, {
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) return console.error(err);
        console.log('Connected to Database');

        const db = client.db('chrome_monitor');
        const collection = db.collection('site_rate');

        app.get('/view_analysis', (req, res) => {
            collection
                .aggregate([{
                    $group: {
                        _id: { host: '$host' },
                        keyPressed: { $sum: '$keyPressed' },
                        scroll: { $sum: '$scroll' },
                        duration: { $sum: '$duration' },
                        clicked: { $sum: '$clicked' },

                        host: { $first: '$host' },
                    },
                }, ])
                .toArray()
                .then((results) => {
                    res.render('index.ejs', { obj: results });
                })
                .catch((error) => console.error(error));
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
        });

        app.post('/test/:data', (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Content-Type', 'application/json')

            const userEventData = JSON.parse(req.params.data);
            collection
                .findOneAndUpdate({ page: userEventData.page }, {
                    $set: {
                        host: userEventData.host,
                        page: userEventData.page,
                    },
                    $inc: {
                        clicked: userEventData.clicked,
                        keyPressed: userEventData.keyPressed,
                        scroll: userEventData.scrol,
                        duration: userEventData.duration,
                    },
                }, {
                    upsert: true,
                }, )
                .then((result) => {

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
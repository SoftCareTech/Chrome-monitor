 const express = require('express');
 const bodyParser = require('body-parser')
 const app = express();
 app.use(bodyParser.urlencoded({ extended: true }))
 const { MongoClient, ObjectId } = require('mongodb')
 app.set('view engine', 'ejs')
 app.use(bodyParser.json())
 app.listen(3000, function() { console.log('Listening on 3000') })



 var connectionString = "mongodb://localhost:27017";
 MongoClient.connect(connectionString, {
     useUnifiedTopology: true
 }, (err, client) => {


     if (err) return console.error(err)
     console.log('Connected to Database')
         ///start db
     const db = client.db('chrome_monitor')
     const collection = db.collection('site_rate')

     app.get('/view_analysis', (req, res) => {
         collection.find().toArray()
             .then(results => {
                 res.render('index.ejs', { obj: results })

             })
             .catch(error => console.error(error))
         console.log(req.body)
     })

     app.get('/analyse/:url', (req, res) => { ///localhost:3000/view
         var url = req.params.url;
         collection.find({ host: url }).toArray()
             .then(results => {
                 res.render('analyse.ejs', { obj: results })

             })
             .catch(error => console.error(error))
         console.log(req.body)
     });

     app.post('/test', (req, res) => {
         console.log("testing")
         console.log(req.body)
         collection.findOneAndUpdate({ page: req.body.page }, {
                     $set: {
                         host: req.body.host,
                         page: req.body.page,
                     },
                     $inc: {
                         "clicked": req.body.clicked,
                         "keyPressed": req.body.keyPressed,
                         "scroll": req.body.scrol,
                         "duration": req.body.duration
                     }
                 }, {
                     upsert: true
                 } /// 'true' will insert if documnt not found
             )
             .then(result => {
                 //  res.json("hi")
                 console.log("result")
                 console.log(result)
             })
             .catch(error => console.error(error))

         res.json("h11")
     })
     app.get('/*', (req, res) => { ///localhost:3000/view
         res.redirect('/view_analysis')

     });

 })
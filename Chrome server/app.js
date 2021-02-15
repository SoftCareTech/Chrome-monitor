// install node
// npm init 
//node app_start.js 
//nodemon   app_start.js  //
// add this script 
/* 
    "dev": "nodemon server.js"   
*/
// to script section .. remember putting ','
// run  'npm run dev' or 'nodemon app_start' last one did't work
/// console.log("Hello js ");   // first ru test
// install express   // for project // make sure you close all files tab
// use express
const express = require('express'); // basic framework for node js
const bodyParser = require('body-parser') /// it help to retrieve form using the json                       action on line body parser installed that warant this
const app = express();


app.use(bodyParser.urlencoded({ extended: true })) //activating it          action on line body parser installed tha waranting this  
const { MongoClient, ObjectId } = require('mongodb') ///install mogodb before this  /// for getting the mongodb id object
app.set('view engine', 'ejs') //// after installing ejs 
app.use(express.static('public')) // tell express to icludde a fold public
app.use(bodyParser.json()) ///allow for json///server doesn’t accept JSON data yet.
    // We can teach it to read JSON by adding the body-parser's json middleware.

//session    https://codeforgeek.com/manage-session-using-node-js-express-4/             2   https://github.com/expressjs/session#options
const session = require('express-session');
app.use(session({ secret: 'my secre', saveUninitialized: true, resave: true }));

var sess



app.use('/users', require('./routes/users').users);
//app.use("/users" , require('./routes/people').users);

////listen on port 3000
app.listen(3000, function() {
        console.log('listening on 3000')

    }) // typing 'localhost:3000'  on the browser will give this 'Cannot GET '



/*
///providing the index 
app.get('/', function(req, res) {
    res.send('Hello World')
  })
  */



app.get('/test', (req, res) => {
    console.log("testing bb")
    console.log(req.body)
    res.send("<h1>hello</h1>")
        //res.sendFile(__dirname + '/index.html')
})






app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


/*
  app.post('/quotes', (req, res) => {
    console.log('Hellooooooooooooooooo!')
    res.send('Hello World')
  })
*/


/*
////install body parser to get input from form
//cmd npm install body-parser --save
//add this to top 
app.post('/usersStatic', (req, res) => {
    console.log(req.body)
})

*/



///insall mogondb lib
// cmd = 'npm install mongodb --save'
/// add const MongoClient = require('mongodb').MongoClient
var connectionString = "mongodb://localhost:27017";

MongoClient.connect(connectionString, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
        ///start db
    const db = client.db('chrome_monitor')
    const userCollectionon = db.collection('site_rate')



    app.post('/test', (req, res) => {
        console.log("testing")
        console.log(req.body)

        ///var _id = new ObjectId(req.body._id); //import Oject before using it
        db.collection('site_rate').findOneAndUpdate({ host: req.body.host }, {
                    $set: {
                        host: req.body.host,
                        page: req.body.page,
                    },
                    $inc: {
                        "clicked%": req.body.clicked,
                        "keyPressed%": req.body.keyPressed,
                        "scrol%": req.body.scrol,
                        "duration%": req.body.duration
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











    //add a user 
    app.post('/adduser', (req, res) => {
        sess = req.session;
        sess.phone = req.body.phone;

        userCollectionon.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/') ///go back to index .... don't stay on adduser
            })
            .catch(error => console.error(error))

    })


    ///  view all users
    app.get('/users', (req, res) => { ///localhost:3000/users
        db.collection('users').find().toArray()
            .then(results => {
                console.log(results)
            })
            .catch(error => console.error(error))
        res.redirect('/')

    })

    /////// add template for redering it result to html
    /// npm install ejs --save
    //app.set('view engine', 'ejs')
    // create folder views and index.ejs inside it
    app.get('/view', (req, res) => { ///localhost:3000/view
        sess = req.session;
        if (sess.phone) {
            console.log(sess.phone)
        }


        db.collection('users').find().toArray()
            .then(results => {
                res.render('index.ejs', { users: results })

            })
            .catch(error => console.error(error))

    })

    // create exter js to perform update 
    //  cmd mkdir public
    // tell expres to use this folder 
    //app.use(express.static('public'))
    // create main.js in public and add it to index.js in views folder

    app.put('/view', (req, res) => {
        console.log(req.body)
    })

    // update  using url data
    app.get('/update/:phone', (req, res) => { ///localhost:3000/view

        db.collection('users').findOne({ phone: req.params.phone })
            .then(results => {
                if (results == null) res.redirect("/view")
                res.render('update.ejs', { user: results })
                    //console.log(results)
            })
            .catch(error => console.error(error))
    })

    // update  using response data
    app.put('/update', (req, res) => {
        // console.log("req.body") 
        var _id = new ObjectId(req.body._id); //import Oject before using it
        db.collection('users').findOneAndUpdate(_id, {
                $set: {
                    phone: req.body.phone,
                    name: req.body.name
                }
            }, {
                upsert: false /// 'true' will insert if documnt not found
            })
            .then(result => {
                res.json("hi")
                console.log(result)
            })
            .catch(error => console.error(error))
    })

    /// delete 
    app.delete('/view', (req, res) => {
        // console.log("req.body") 
        var _id = new ObjectId(req.body._id); //import Oject before using it
        db.collection('users').deleteOne({ _id })
            .then(result => {
                // console.log(result)
                if (result.deletedCount === 0) {
                    return res.json('No user to delete')
                }
                res.json("Deleted " + result.name + " quote")

            })
            .catch(error => console.error(error))
    })

    //end database

})
// load Express.js
const express = require('express')
const app = express()
const fetch = require("node-fetch")
const fs = require('fs')
const http = require('http')
const path = require('path')
var publicPath = path.resolve(__dirname, 'static')
var imagePath = path.resolve(__dirname, 'images')

// parse the request parameters
app.use(express.json())


// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db; MongoClient.connect('mongodb+srv://fenechjeanpierre:P@ssWORD1@cluster0.xfu9d.mongodb.net/myapp?retryWrites=true&w=majority', (err, client) => {
   db = client.db('myapp')
    })
    
//main page
   app.get('/static/index.html', function (req, res) {res.send('')
  })
    
//index and images path
app.use('static/index.html', express.static(publicPath));
app.use('static/images', express.static(imagePath));


// get the collection name
        app.param('collectionName', (req, res, next, collectionName) => {
            req.collection = db.collection(collectionName)
// console.log('collection name:', req.collection)
                return next()
    })

// dispaly a message for root path to show that API is working
    app.get('/', function (req, res) {res.send('Select a collection, e.g., /collection/lessons')
    })

// retrieve all the objects from an collection
        app.get('/collection/:collectionName', (req, res) => {req.collection.find({}).toArray((e, results) => {
            if (e) return next(e)
                res.send(results)
    })

})

//retrieve an object by Mogodb ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next)  =>  {
    req.collection.findOne (
        { _id: new ObjectID(req.params.id)  },
        (e, result)  => {
            if (e) return next(e)
            res.send(result)
        })
})

 //add an object
        app.post('/collection/:collectionName', (req, res, next) =>  {
                    req.collection.insert(req.body,  (e, results)  =>  {
                        if (e) return(e)
                            res.send(results.ops)
            })
 })

 // update an object by ID
        app.put('/collection/:collectionName/:id', (req, res, next) => {
                req.collection.update(
                    { _id: new ObjectID(req.params.id) },
                    { $set: req.body },
                    { safe: true, multi: false },(e, result) => {
                    if (e) return next(e)
                                res.send((result.result.n === 1) ?
                                    {msg: 'success'} : { msg: 'error'})
                        })
})

// delete an object by ID
    app.delete('/collection/:collectionName/:id', (req, res, next) => {
            req.collection.deleteOne(
                { _id: ObjectID(req.params.id) },(e, result) => {
            if (e) return next(e)
                res.send((result.result.n === 1) ?
                    {msg: 'success'} : {msg: 'error'})
            })
})


//MiddleWare
app.use(function (req, res, next) {
    next();
  });
  
  app.use(function (req, res, next) {
        var filePath = path.join(__dirname, "static/indexl.html", req.url);
    fs.stat(filePath, function (err, fileInfo) {
      if (err) {
        next();
        return;
      }
      if (fileInfo.isFile()) res.sendFile(filePath);
      else next();
    });
  });

//   app.use(function (req, res, next) {
//     var filePath = path.join(__dirname, "static/images", req.url);
// fs.stat(filePath, function (err, fileInfo) {
//   if (err) { 
//     next();
//     return;
//   }
//   if (fileInfo.isFile()) res.sendFile(filePath);
//   else next();
// });
// });
  
  app.use(function (req, res) {
    res.status(404);
    res.send("Page or file not found ! Error 404! Check your URL!");
  });

const port = process.env.PORT || 3000
app.listen(port);
console.log ('server running on port' & port);

// app.listen(3210, function(){
//     console.log("running port 3210");
// });

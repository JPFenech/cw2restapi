// load Express.js
const express = require('express')
const app = express()
const fetch = require("node-fetch")
const http = require('http')
const path = require('path')
const publicPath = path.resolve(__dirname, "static")


// parse the request parameters
app.use(express.json())
app.use(express.static(publicPath))


// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;let db;
MongoClient.connect('mongodb+srv://fenechjeanpierre:P@ssWORD1@cluster0.xfu9d.mongodb.net/myapp?retryWrites=true&w=majority', (err, client) => {
   db = client.db('myapp')
    })

// get the collection name
        app.param('collectionName', (req, res, next, collectionName) => {
            req.collection = db.collection(collectionName)
// console.log('collection name:', req.collection)
                return next()
    })

// dispaly a message for root path to show that API is working
    app.get('/static/index.html', function (req, res) {res.send('Select a collection, e.g., /collection/lessons')
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

const port = process.env.PORT || 3000
app.listen(port);
console.log ('server running on port' & port);

// app.listen(3210, function(){
//     console.log("running port 3210");
// });

var webstore = new Vue({
    el: '#app',
    data: {
        showProduct: true,
        sitename: 'LESSONS 4 ALL',
        cart: [], // array to store items in shopping cart,
            order: {
            firstName: "",
            number: "",

        },
        products: products,



        created: function() { // this function will be run automatically
// when creating the Vue instance
fetch('https://jeancw2.herokuapp.com/collection/lessons').then(function (response) {
response.json().then(function (json) {
// save the returned JSON object to 'product'
// note that we used 'store.product' instead of 'this.product'
store.product = json;
});

})
}
   },
    
    methods:{
        addToCart: function (product) {
            this.cart.push(product.id);
        },

        addToCheckOutCart(product){
            this.addToCheckOutCart.push(product);
        },
        showCheckout: function(){
            this.showProduct = this.showProduct ? false : true;
        },
        
        onSubmit(){
            alert('Your booking has been confirmed!')
        },
     
         canAddToCart: function(product){
            return product.availableInventory > this.cartCount(product.id);
        },
        //cartCount Method to count the number of items of a particular type in the cart
        cartCount(id){
            let count = 0;
            for (let i = 0; i < this.cart.length; i++){
                if(this.cart[i] === id){
                    count++
                }
            }
            return count;
        },

        //text validation for Name + Surname + Address + Tel
        isLetter(e) {
        let char = String.fromCharCode(e.keyCode); 
        if(/^[A-Za-z ]$/.test(char)) return true; 
        else e.preventDefault(); // If no match, this will not allow keypress
        },

    
        
        sortS: function () {
        this.products.sort(this.sortSub);
        },
        reverse: function () {
        this.products.reverse();
        },

        sortP: function () {
        this.products.sort(this.sortPri);
        },
        reverse: function () {
        this.products.reverse();
        },

        sortL: function () {
        this.products.sort(this.sortLoc);
        },
        reverse: function () {
        this.products.reverse();
        },

        sortI: function () {
        this.products.sort(this.sortInv);
        },
        reverse: function () {
        this.products.reverse();
        },

         sortSub: function (a,b) {
         if(a.subject > b.subject)
         return 1;
         if (a.subject < b.subject)
         return -1;
         return 0;
         },

         sortPri: function (a,b) {
         if(a.price > b.price)
         return 1;
         if (a.price < b.price)
         return -1;
         return 0;
         },

         sortLoc: function (a,b) {
         if(a.location > b.location)
         return 1;
         if (a.location < b.location)
         return -1;
         return 0;
         },

         sortInv: function (a,b) {
         if(a.availableInventory > b.availableInventory)
         return 1;
         if (a.availableInventory < b.availableInventory)
         return -1;
         return 0;
         },

                     
    },

       computed: {
        cartItemCount: function(){
            return this.cart.length;
            },
        
                        //isDisabled: function(){
          //  return !this.order;
          //  },

        //We are sorting products by price
        //removeing sorting of items by price from default and added in method
        
        //sortedProducts(){
        //    let productsArray = this.products.slice(0);

        //    function compare (a, b){
        //        if(a.price > b.price)
        //       return 1;
        //        if (a.price < b.price)
        //        return -1;
        //        return 0;
        //    }
        //    return productsArray.sort(compare);
        //},

    

      
    },
});

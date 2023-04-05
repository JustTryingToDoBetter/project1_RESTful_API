const mongoose = require('mongoose');
const Product = require("../models/product");


exports.getAll = (req, res) => {
    console.log(req.file);
    Product.find()
    .select('name price _id productImage') //controls what data you want to request
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price, 
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        };

        // if (docs.length >= 0){
        res.status(200).json(docs);
        // }else{
        //     res.send(404).json({
        //         message: "No entries found"
        //     })
        // }
        
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({error: err});
    })
}

exports.createProduct = (req, res) => {  
    // this is sent to the database
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //stores it to the db
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "hi there agaoini",
            createdProduct: 
            {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

}

exports.getProduct = (req, res) =>{
    const id = req.params.productId;
    Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc=> {
        console.log(doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"
                }
            });
        }else{
            res.status(404).json({
                message: "no valid entry found"
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({error: err});
    });
    
}

exports.updateProduct = (req, res) =>{
    const id = req.params.productId;
    const updateOps = {};
    // incase we want to change either a name or price or both
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id : id}, { $set: updateOps})
    .exec()
    .then(result => {
        res.send(200).json(
            {
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            });
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({error: err});
    });
}



exports.deleteProduct = (req, res) =>{
    const id = req.params.productId;
    // remove any values with this property
    Product.remove({_id : id})
    .exec()
    .then( res => {
        res.send(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/productds',
                body: { name: "String", price: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({error: err});
    });
}
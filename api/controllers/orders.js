const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require('mongoose');

exports.orders_getAll = (req, res) => {
  Order.find()
    .select("product quantity _id")
    .populate('product', "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "https://localhost:3000/orders" + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

exports.createOrder = (req, res) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save()
    })
    .then(result => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "https://localhost:3000/orders" + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err })
    });

}

exports.getOrder = (req, res) => {
  Order.findById(req.params.orderID)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "https://localhost:3000/orders" + order._id
        }
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

exports.deleteOrder = (req, res) => {
  Order.remove({ _id: req.params.orderID })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "https://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" }
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

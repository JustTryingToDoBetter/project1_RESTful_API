
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "email already exists"
            })  ///409 means conflict 422 means unprocessable entity
        }else{
            //hash a password
    bcrypt.hash(req.body.password, 10, (err, hash)=> {
        if(err){
            return res.status(500).json({
                error: err
            });
        }else{
            // here the new user is created
            const user = new User({
                _id: mongoose.Schema.Types.ObjectId,
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(result => {
                res.status(201).json({
                    message: "user created"
                });
            })
            .catch(err => {
                res.status(500).json({error : err});
            });
            
        }
    })

        }
    });
}


exports.loginUser = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_Key, {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "auth successful"
                });
            }
            res.status(401).json({
                message: "Auth failed",
                token: token
            });

        })
    })
    .catch(err => {
        res.status(500).json({error : err});
    });
}

exports.deleteUser = (req, res, next) => {
    User.removeListener({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "user deleted"
        })
    })
    .catch(err => {
        res.status(500).json({error : err});
    });
    
}
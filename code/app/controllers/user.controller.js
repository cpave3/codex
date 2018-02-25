'use strict';

const User = require('../models/user.model.js');

exports.create = (req, res) => {
    // Create and save
    if(!req.body.content) {
        res.status(400).send({message: 'User can not be empty'});
    }

    const user = new User({
        email: req.body.email,
        username: req.body.username
    });

    user.save((err, data) => {
        console.log('[#] ' + data);
        if(err) {
            console.log('[!] ' + err);
            res.status(500).send({message: 'An unknown error has occured while creating the user.'});
        } else {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
    // find all users
    User.find((err, users) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding users'});
        } else {
            res.send(users);
        }
    });
};

exports.findOne = (req, res) => {
    // find one user by ID
    User.findById(req.params.userId, (err, data) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding user'});
        } else {
            res.send(data);
        }
    });
};

exports.update = (req, res) => {
    // update a user
    User.findById(req.params.userId, (err, user) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding user'});
        }

        user.title = req.body.title;
        user.content = req.body.content;

        user.save((err, data) => {
            if(err) {
               res.status(500).send({ message: 'Could not update user with id ' + req.params.userId });
            } else {
                res.send(data);
            }
        });
    });
};

exports.delete = (req, res) => {
    // delete a user
    User.remove({ _id:req.params.userId }, (err, data) => {
        if(err) {
            res.status(500).send({ message: 'Could not delete the user with id ' + req.params.userId });
        } else {
            res.send({ message: 'User deleted' });
        }
    });
};

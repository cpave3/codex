'use strict';

const User = require('../models/user.model.js');

exports.register = (req, res) => {
    // Take the input of a new user request, validate it and if successful, create a new user.
    if(!req.body.username || !req.body.email || !req.body.password) {
        // If one of the 3 required fields are empty, reject the request
        // TODO: Add more detail here about why the request was rejected, specifically
        res.status(400).send({message: 'User can not be empty', reqBody: req.body});
    }

    //TODO: Should have input validation here, before we insert the request data into the model

    // If everything is okay with the request, create a new user object
    // Password gets hashed in the pre.save user middleware
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    user.save((err, data) => {
        
        // TODO: Implement more verbose error handling here
        if(err) {
            console.log('[!] ' + err);
            res.status(500).send({message: err});
        } else {
            console.log('[#] ' + data);
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

exports.login = function(req, res) {
    //take the standard login details and output the JWT
    if(!req.body.username || !req.body.password) {
        res.status(400).send({ message: 'Username and Password required' });
    } else {
        User.findOne({ username: req.body.username}, (err, user) => {
            if (err) {
                console.log('[!] ' + err);
                res.status(500).send({success: false, message: err});
            } else {
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (err) {
                        console.log('[!] ' + err);
                    }
                    if (isMatch) {
                        res.send(user.toAuthJSON());
                    } else {
                        res.status(500).send({ message: 'AU001: Something went wrong' });
                    }
                }); 
            }
            //if(err) {
            //    res.status(500).send({ success: false, message: err })
            //} else if(user.validPassword(req.body.password)) {
            //    res.send(user.toAuthJSON);
            //} else {
            //    res.status(401).send({ message: 'Username or Password is incorrect' });
            //}
        }); 
    }
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

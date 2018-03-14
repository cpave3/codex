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
            res.status(500).send({errors: err.errors, message: err.message, success: false});
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

/**
 * Allows users to submit login credentials to the unsecured api endpoint
 */
exports.login = (req, res) => {
    let authUser;
    if(!req.body.username || !req.body.password) {
        res.status(400).send({ message: 'Username or Email and Password required' });
        return;
    } 
    User.findOne({ username: req.body.username})
    .then((user) => {
        if (!user) {
            res.status(403).json({ success: false, message: "Username or password is incorrect." });
            return;
        }
        authUser = user;
        return user.comparePassword(req.body.password);

    })
    .then((match) => {
        if (match === true) {
            res.status(200).json({ success: true, data: authUser.toAuthJSON() })
            return;
        } else if (match === false) {
            res.status(403).json({ success: false, message: "Username or password is incorrect." });
            return;
        }
    })
    .catch((err) => {
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
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

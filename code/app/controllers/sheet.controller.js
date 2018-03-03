'use strict';

const _ = require('underscore');

const Sheet = require('../models/sheet.model.js');
const User  = require('../models/user.model.js'); 

/**
 * Create a new sheet associated to the requesting user
 */
exports.create = (req, res) => {
    
    let success = true;
    let message = '';

    if (!req.body.name) {
        // Name is required, but description defaults to null, and public defaults to false.
        success = false;
        message = `The value of 'name' cannot be null`;
        res.status(400).json({success, message});
    } else {
        // Check that the other fields are defaulted correctly.
        if (req.body.public == 'true') req.body.public = true;
        if (req.body.public != true) req.body.public = false;
        if (!req.body.description) req.body.description = null;
    }

    if (success) {
        // Check that the user does not currently have this sheet name in use.
        Sheet.count({ name: req.body.name, user: req.decoded.id }, (err, sheet) => {
            console.log(`Query count: ${sheet}`);
            if (err) {
                console.log(`[!] ${err}`);
                success = false;
                message = err;
                res.status(500).json({success, message});
            } else if (sheet > 0) {
                console.log(`[!] User ${req.decoded.username} attempted to create a sheet with a duplicate name.`);
                success = false;
                message = `The name ${req.body.name} is already in use. Please use another.`;
                res.status(400).json({success, message});
            }

           if (success) {
                // Create a new sheet for the User here.
                const sheet = new Sheet({
                    name: req.body.name,
                    description: req.body.description,
                    public: req.body.public,
                    user: req.decoded.id
                });

                sheet.save((err, sheet) => {
                    if (err) {
                        console.log(`[!] ${err}`);
                        success = false;
                        message = err
                        res.status(500).json({success, message});
                    }

                    if (success) {
                        console.log(`[*] Record saved for user: ${req.decoded.username}`);
                        res.status(201).json({success, message: sheet});
                    }
                });
           } 

        });
    }
};

/**
* Returns all accessible sheets for a specified user.
* The requesting user can see all of their own sheets.
* The requesting user can only see public sheets of other users.
*/
exports.findAll = (req, res) => {
    // 1. Validate token (middleware)
    // 2. Validate requested user exists
    // 3. If requested user == requesting user, find all sheets
    // 4. If requested user <> requesting user, show only sheets where public == true 
    
    // Determine whether the requested user exists or not
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
            console.log(`[!] ${err}`);
            res.status(500).json({ success: false, message: err.message });
        } else if (!user) {
            message = `Requested user '${req.params.username}' not found.`;
            console.log(`[!] ${message}`);
            res.status(404).json({ success: false, message: message });
        } else {
            // We can assume that a matching user was found
            Sheet.find({ user: user.id }, (err, sheets) => {
                if (err) {
                    console.log(`[!] ${err}`);
                    res.status(500).json({ success: false, message: err.message });
                } else {
                    if (user.id != req.decoded.id) {
                        // The user should only be able to access public sheets, apply a filter
                        res.status(200).json({ success: true, data: _.where(sheets, { public: true }) });
                    } else {
                        // Return all sheets on the user
                        res.status(200).json({ success: true, data: sheets });
                    }
                }
            });
        }
    });

};

exports.findOne = (req, res) => {
    // find one sheet by ID
    Sheet.findById(req.params.sheetId, (err, data) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding sheet'});
        } else {
            res.send(data);
        }
    });
};

exports.update = (req, res) => {
    // update a sheet
    Sheet.findById(req.params.sheetId, (err, sheet) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding sheet'});
        }

        sheet.title = req.body.title;
        sheet.content = req.body.content;

        sheet.save((err, data) => {
            if(err) {
               res.status(500).send({ message: 'Could not update sheet with id ' + req.params.sheetId });
            } else {
                res.send(data);
            }
        });
    });
};

exports.delete = (req, res) => {
    // delete a sheet
    Sheet.remove({ _id:req.params.sheetId }, (err, data) => {
        if(err) {
            res.status(500).send({ message: 'Could not delete the sheet with id ' + req.params.sheetId });
        } else {
            res.send({ message: 'Sheet deleted' });
        }
    });
};

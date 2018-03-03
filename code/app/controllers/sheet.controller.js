'use strict';

const Sheet = require('../models/sheet.model.js');

exports.create = (req, res) => {
    
    // TODO
    // We are creating a new sheet, bound to the requesting User.
    // We need to go through a number of steps to make this method robust
    // 1. Validate the user token (handled in middleware)
    // 2. Verify that the request contains the required fields (Name(String)*, Description(text)=null, Public(bool)=false)
    // 3. Validate that this user does not already have a sheet with this name
    // 4. Create a new instance of the model and fill it with the data
    // 5. Save it to the DB with a reference to the owner-user
    
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

exports.findAll = (req, res) => {
    // find all sheets
    Sheet.find((err, sheets) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding sheets'});
        } else {
            res.send(sheets);
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

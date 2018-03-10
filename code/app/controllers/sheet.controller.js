'use strict';

const _ = require('underscore');

const Sheet = require('../models/sheet.model.js');
const User  = require('../models/user.model.js'); 

/**
 * Create a new sheet associated to the requesting user
 */
exports.create = (req, res) => {
    // 1. Validate inputs
    if (!req.body.name) {
        // Name is required, do an error
        res.status(400).json({ success: false, message: `the 'name' field is required` });
    } else {
        // Check/default other fields
        if (req.body.public === 'true' || req.body.public === 'True') req.body.public = true;
        if (req.body.public != true) req.body.public = false;
        if (!req.body.description) req.body.description = null;

        // 2. Validate existence of desired sheet name
        Sheet.findOne({ name: req.body.name, user: req.decoded.id }).
        then((sheet) => {
            if (!sheet) {
                // 3. Create and serve sheet
                const newSheet = new Sheet({
                    name: req.body.name,
                    description: req.body.description,
                    public: req.body.public,
                    user: req.decoded.id
                });
                return newSheet.save();
            } else {
                res.status(400).json({ success: false, message: `You already have a sheet with this name.` });
                return false;
            }
        }).
        then((sheet) => {
            if (sheet) {
                res.status(201).json({ success: true, data: sheet });
            }
        }).
        catch((err) => {
            console.log(`[!] ${err}`);
            res.status(500).json({ success: false, message: err.message });
        });
    }
};

/**
* Returns all accessible sheets for a specified user.
* The requesting user can see all of their own sheets.
* The requesting user can only see public sheets of other users.
*/
exports.findAll = (req, res) => {
    // Determine whether the requested user exists or not
    if (!req.params.userId) req.params.userId = req.decoded.id;
    Sheet.find({ user: req.params.userId }).
    then((sheets) => {
        if (sheets) {
            if (req.params.userId === req.decoded.id) {
                // same user, show all
                res.status(200).json({ success: true, data: sheets });
            } else {
                // diff user, show public
                res.status(200).json({ success: true, data: _.where(sheets, { public: true }) });
            }    
        } else {
            // no sheets found, 404
            res.status(404).json({ success: false, message: 'No sheets could be found for this request' });
        }
    }).
    catch((err) => {
        //err
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
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

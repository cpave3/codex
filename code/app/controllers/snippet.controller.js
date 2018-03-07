'use strict';

const _ = require('underscore');

const User = require('../models/user.model.js');
const Snippet = require('../models/snippet.model.js');
const Sheet = require('../models/sheet.model.js');

/**
 * This method creates a unique snippets within a sheet.
 * The snippet's name must be unique within the sheet.
 * The snippet name and content are required, tags are optional.
 */
exports.create = (req, res) => {
    // 1. validate the requesting user has a sheet with the specified name
    // 2. validate the specified sheet does not have a snippet with the requested name
    // 3. validate all required fields are present
    // 4. create a snippet with the requested name in the specified sheet
    let message;
    if (!req.body.name || !req.body.content) {
        res.status(400).json({ success: false, message: `Snippet 'body' and 'content' cannot be null` });
    } else {
        Sheet.findOne({ name: req.params.sheetName, user: req.decoded.id }, (err, sheet) => {
            if (err) {
                console.log(`[!] ${err}`);
                res.status(500).json({ success: false, message: err.message });
            } else if (!sheet) {
                message = `Requested sheet '${req.params.sheetName}' does not exist.`;
                console.log(`[!] ${message}`);
                res.status(404).json({ success: false, message });
            } else {
                // Assume a matching sheet was found, and our required request values are present.
                // Make sure no snippets exist with this name currently.
                Snippet.findOne({ name: req.body.name, sheet: sheet.id }, (err, oldSnippet) => {
                    if (err) {
                        console.log(`[!] ${err}`);
                        res.status(500).json({ success: false, message: err.message });
                    } else if (oldSnippet) {
                        message = `A snippet with the name '${req.body.nam}' already exists on the sheet '${sheet.name}'`;       
                        console.log(`[!] ${message}`);
                        res.status(400).json({ success: false, message });
                    } else {
                        // Everything checks out, we should be alright to make a new snippet here.
                        const snippet = new Snippet({
                            name: req.body.name,
                            content: req.body.content,
                            tags: req.body.tags,
                            sheet: sheet.id
                        });

                        snippet.save((err, data) => {
                            if (err) {
                                console.log(`[!] ${err}`);
                                res.status(500).json({ success: false, message: err.message });
                            } else {
                                res.status(201).json({ success: true, data });
                            }
                        });


                    }
                });
            }
        });
    }
};

/**
 * Return all snippets from the specified sheet, provided that the sheet belongs to the requester
 */
exports.findAll = (req, res) => {
    // 1. find a sheet with the specified id, which either belongs to the requesting user, or is public
    Sheet.findOne({ _id: req.params.sheetId, $or: [{ public: true }, { user: req.decoded.id }] })
    .then((sheet) => {
        if (!sheet) {
            res.status(404).json({ success: false, message: 'The requested sheet could not be found' });
            return false;
        } else {
            return Snippet.find({ sheet: sheet.id })
        }
    })
    .then((snippets) => {
        if (snippets) {
            res.status(200).json({ success: true, data: snippets });
        }
    })
    .catch((err) => {
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
    });
};

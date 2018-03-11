'use strict';

const _ = require('underscore');

const User = require('../models/user.model.js');
const Snippet = require('../models/snippet.model.js');
const Sheet = require('../models/sheet.model.js');

/** 
 * Create a snippet within a sheet which the requesting user owns. 
 */

exports.create = (req, res) => {
    // 1. validate the requesting user has a sheet with the specified name
    // 2. validate the specified sheet does not have a snippet with the requested name
    // 3. validate all required fields are present
    // 4. create a snippet with the requested name in the specified sheet
    
    if (!req.body.name || !req.body.content) {
        res.status(400).json({ success: false, message: `The 'name' and 'content' fields cannot be null` });
        return;
    }
    
    Sheet.findOne({ _id: req.params.sheetId, user: req.decoded.id }).
    then((sheet) => {
        if (!sheet) {
            res.status(404).json({ success: false, message: `The requsted sheet could not be found` });
            return false;
        } else {
            return Snippet.findOne({ name: req.body.name, sheet: sheet.id });
        }
    }).
    then((existingSnippet) => {
        if (existingSnippet) {
            res.status(400).json({ success: false, message: `A sheet with the name '${req.body.name}' already exists.` });
            return false
        } else {
            const snippet = new Snippet({
                name: req.body.name,
                content: req.body.content,
                tags: req.body.tags,
                sheet: req.params.sheetId
            });

            return snippet.save();
        }
    }).
    then((snippet) => {
        if (snippet) {
            res.status(201).json({ success: true, data: snippet });
        }
    }).
    catch((err) => {
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
    });
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

/**
 * Finds a single snippet from a specified sheet, and returns all details about the snippet
 */
exports.findOne = (req, res) => {
    // 1. find sheet by ID< verify ownership/public --
    // 2. find snippet by id, verify accessibility by sheet
    // 3. return snippet
    
    Snippet.findOne({ _id: req.params.snippetId }).
    populate('sheet').
    then((snippet) => {
        if (!snippet || !snippet.sheet || !(snippet.sheet.public === true || snippet.sheet.user === req.decoded.id)) {
            res.status(404).json({ success: false, message: 'The requested snippet could not be found' });
            return false;
        } else {
            res.status(200).json({ success: true, data: snippet });
        }
    }).
    catch((err) => {
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
    });
        
};

/**
 * Takes input values and updates the specified snippet with them
 */
exports.update = (req, res) => {
    // 1. First we need to validate any incomming inputs and maybe build them into an input object
    req.newData = {};  
    if (req.body.name) req.newData.name = req.body.name;
    if (req.body.content) req.newData.content = req.body.content;

    // 2. find the snippet, then its sheet. validate access to the sheet
    Snippet.findOne({ _id: req.params.snippetId }).populate('sheet').
    then((snippet) => {
        // Verify that we have access to this snippet via its sheet
        if (!snippet || !snippet.sheet || (snippet.sheet.public === true || snippet.sheet.user === req.decoded.id)) {
            res.status(403).json({ success: false, message: 'You do not have access to this snippet\'s sheet' });
            return false;
        } else {
            return snippet;
        }
    }).
    then((snippet) => {
        // 3. update the snippet
        if (snippet) {
            return Snippet.findOneAndUpdate({ _id: req.params.snippetId }, req.newData);
        }
    }).
    then((snippet) => {
        res.status(200).json({ success: true, message: 'Snippet updated successfully' });
    }).
    catch((err) => {
        console.log(`[!] ${err}`);
        res.status(500).json({ success: false, message: err.message });
    });

};

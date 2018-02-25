'use strict';

const Note = require('../models/sheet.model.js');

exports.create = (req, res) => {
    // Create and save
    if(!req.body.content) {
        res.status(400).send({message: 'Note can not be empty'});
    }

    const sheet = new Note({
        title: req.body.title || 'Untitled Note',
        content: req.body.content
    });

    sheet.save((err, data) => {
        console.log('[#] ' + data);
        if(err) {
            console.log('[!] ' + err);
            res.status(500).send({message: 'An unknown error has occured while creating the sheet.'});
        } else {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
    // find all sheets
    Note.find((err, sheets) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding sheets'});
        } else {
            res.send(sheets);
        }
    });
};

exports.findOne = (req, res) => {
    // find one sheet by ID
    Note.findById(req.params.sheetId, (err, data) => {
        if(err) {
            res.status(500).send({message: 'An error occured while finding sheet'});
        } else {
            res.send(data);
        }
    });
};

exports.update = (req, res) => {
    // update a sheet
    Note.findById(req.params.sheetId, (err, sheet) => {
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
    Note.remove({ _id:req.params.sheetId }, (err, data) => {
        if(err) {
            res.status(500).send({ message: 'Could not delete the sheet with id ' + req.params.sheetId });
        } else {
            res.send({ message: 'Note deleted' });
        }
    });
};

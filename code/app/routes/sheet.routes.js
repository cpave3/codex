'use strict';

module.exports = (app) => {
    const sheets = require('../controllers/sheet.controller.js');

    app.post('/sheets', sheets.create);

    app.get('/:username/sheets', sheets.findAll);

    app.get('/:username/sheets/:sheetName', sheets.findOne); // TODO

    app.put('/:username/sheets/:sheetName', sheets.update); // TODO

    app.delete('/:username/sheets/:sheetId', sheets.delete); // TODO
};

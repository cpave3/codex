'use strict';

module.exports = (app) => {
    const sheets = require('../controllers/sheet.controller.js');

    app.post('/sheets', sheets.create);

    app.get('/sheets', sheets.findAll);

    app.get('/sheets/:sheetId', sheets.findOne);

    app.put('/sheets/:sheetId', sheets.update);

    app.delete('/sheets/:sheetId', sheets.delete);
};

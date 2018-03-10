module.exports = (app) => {
    const sheets = require('../controllers/sheet.controller.js');

    app.post('/sheets', sheets.create); // Creates a sheet associated to the requesting user

    app.get('/users/:userId/sheets', sheets.findAll); // Find all public sheets associated to a user
    
    app.get('/sheets', sheets.findAll); // find all sheets associated to the requesting user

    app.get('/sheets/:sheetId', sheets.findOne); // TODO: Find a single sheet by ID (if allowed to access)

    app.put('/sheets/:sheetId', sheets.update); // TODO: Updates the name and publicity status of an owned sheet

    app.delete('/sheets/:sheetId', sheets.delete); // TODO: Deletes an owned sheet
};

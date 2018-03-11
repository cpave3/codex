'use strict';

module.exports = (app) => {
    const snippets = require('../controllers/snippet.controller.js');

    app.post('/sheets/:sheetId/snippets', snippets.create);

    app.get('/sheets/:sheetId/snippets', snippets.findAll);

    app.get('/snippets/:snippetId', snippets.findOne);

    app.patch('/snippets/:snippetId', snippets.update);

    app.delete('/snippets/:snippetId', snippets.delete);
};

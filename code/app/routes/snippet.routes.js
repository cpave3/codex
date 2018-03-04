'use strict';

module.exports = (app) => {
    const snippets = require('../controllers/snippet.controller.js');

    app.post('/:sheetName/snippets', snippets.create);

    app.get('/:username/:sheetName/snippets', snippets.findAll); // TODO

    //app.get('/:sheetName/snippets/:snippetName', snippets.findOne); // TODO

    //app.put('/:sheetName/snippets/:snippetName', snippets.update); // TODO

    //app.delete('/:sheetName/snippets/:snippetId', snippets.delete); // TODO
};

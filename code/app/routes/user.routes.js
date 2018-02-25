'use strict';

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    app.post('/users', users.create);

    app.post('/login', users.login);

    app.get('/users', users.findAll);

    app.get('/users/:userId', users.findOne);

    app.put('/users/:userId', users.update);

    app.delete('/users/:userId', users.delete);
};

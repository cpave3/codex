'use strict';

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    app.post('/register', users.register);

    app.post('/login', users.login);

    // These routes below are more for testing and development
    app.get('/users', users.findAll);

    app.get('/users/:userId', users.findOne);

    app.put('/users/:userId', users.update);

    app.delete('/users/:userId', users.delete);
    // end dev routes
};

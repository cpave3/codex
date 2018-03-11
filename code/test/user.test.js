'use strict';

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

const User = require('../app/models/user.model.js');
const Sheet = require('../app/models/sheet.model.js');
const Snippet = require('../app/models/snippet.model.js');

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}).
        then(() => {
            done();
        }).
        catch((err) => {
            console.log(`[!] ${err}`);
        });
    });

    describe('/POST register - valid', () => {
        it('it should create and return a new user with valid input'), (done) => {
            const user = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password'
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                });
        }
    });
});

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'can\'t be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'can\'t be blank'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    hash: String,
    salt: String
}, {
    timestamps: true
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

module.exports = mongoose.model('User', UserSchema);

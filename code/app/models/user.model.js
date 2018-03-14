const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../../config/app.config.js').general.secret;
const SALT_WORK_FACTOR = 10;

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
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Password hashing middleware
// This gets executed before the model is saved
UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

// Check if the submitted password is the same as the stored one
UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, match) => {
            if (err) return reject(err);
            resolve(match);
        });
    });
};

UserSchema.methods.getAllSheets = function(sheetModel) {
    return sheetModel.find({ user: this.id });
};

UserSchema.methods.getPublicSheets = function(sheetModel) {};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
    };
};

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

module.exports = mongoose.model('User', UserSchema);

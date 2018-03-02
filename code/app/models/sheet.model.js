const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SheetSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        match: [/^[a-z0-9]+$/, 'is invalid']
    },
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    records: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('Sheet', SheetSchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SheetSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        match: [/^[a-z0-9]+$/, 'is invalid']
    },
    description: {
        type: String,
        required: false
    },
    public: {
        type: Boolean,
        default: false
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
});

module.exports = mongoose.model('Sheet', SheetSchema);

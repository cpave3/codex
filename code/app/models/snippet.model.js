const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SnippetSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        match: [/^[a-z0-9]+$/, 'is invalid']
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        require: false
    },
    sheet: {type: mongoose.Schema.Types.ObjectId, ref: 'Sheet'},
}, {
    timestamps: true
});

module.exports = mongoose.model('Snippet', SnippetSchema);

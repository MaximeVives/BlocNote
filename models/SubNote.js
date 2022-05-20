const mongoose = require("mongoose");

const SubNote = mongoose.Schema({
    content: {
        type: String,
        default: "",
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("SubNote", SubNote);
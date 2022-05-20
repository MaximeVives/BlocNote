// Mongoose schema for the user model
const mongoose = require("mongoose");
const SubNote = require("./SubNote");

const Note = mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Note Title",
        unique: false
    },
    list_Notes: {
        type: Array,
        required: true,
        minlength: 1,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("Note", Note);
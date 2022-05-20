// Mongoose schema for the user model
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    last_login: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

User.pre('create', function (next) {
    const user = this;
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});

module.exports = mongoose.model("User", User);
let User = require('../models/User');
let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config("../.env");
let crypto = require('crypto');

const short_time = 60 * 60 * 1000;
const long_time = 365 * 24 * 60 * 60 * 1000;
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;


function random32hex() {
    return crypto.randomBytes(32).toString('hex');
}

async function register(req, res) {
    let {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        })
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        })
    } else if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long'
        })
    }
    password = bcrypt.hashSync(password, 10);

    const newUser = new User({
        email,
        password,
        token: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLogin: Date.now()
    });

    newUser.tokens = {
        "access": jwt.sign({_id: newUser._id, die: Date.now() + short_time}, process.env.PRIVATE_KEY),
        "token": jwt.sign({
            _id: newUser._id,
            code: random32hex(),
            die: Date.now() + long_time,
            infinite_token: false
        }, process.env.PRIVATE_KEY)
    };

    try {
        await newUser.save();
        res.status(200).json({
            success: true,
            token: newUser.tokens[0].token,
        });

    } catch (error) {
        res.status(400).send({message: "User already exists", success: false});
    }
}

async function login(req, res) {
    let {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        })
    }else if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        })
    }
    let user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password'
        })
    }

    user.last_login = Date.now();
    await user.save();

    res.status(200).json({
        success: true,
        message: 'User found',
        token: user.tokens[0].token
    });
}

async function reset_token(req, res) {
    let {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        })
    }else if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        })
    }

    let user = await User.findOne({email: email});
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }
    password = bcrypt.compareSync(password, user.password);
    console.log(password);
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password'
        })
    }

    user.tokens = {
        "access": jwt.sign({_id: user._id, die: Date.now() + short_time}, process.env.PRIVATE_KEY),
        "token": jwt.sign({
            _id: user._id,
            code: random32hex(),
            die: Date.now() + long_time,
            infinite_token: false
        }, process.env.PRIVATE_KEY)
    }
    user.updatedAt = Date.now();
    user.save();

    res.status(200).json({
        success: true,
        message: 'Token reseted',
        token: user.tokens[0].token
    })
}

async function longlifetoken(req, res) {
    let {token} = req.body;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        })
    }
    let tok = null
    try {
        tok = jwt.verify(token, process.env.PRIVATE_KEY);
    }catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        })
    }
    if (tok==null) {
        return res.status(400).json({
            success: false,
            message: 'Token not valid'
        })
    }
    if (tok.infinite_token) {
        return res.status(400).json({
            success: false,
            message: 'Token already valid'
        })
    }
    if (tok.die < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Token expired'
        })
    }
    let user = await User.findOne({_id: tok._id});
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }
    user.tokens = {
        "access": jwt.sign({_id: user._id, die: Date.now() + short_time}, process.env.PRIVATE_KEY),
        "token": jwt.sign({
            _id: user._id,
            code: random32hex(),
            die: Date.now() + long_time,
            infinite_token: true
        }, process.env.PRIVATE_KEY)
    }
    user.updatedAt = Date.now();
    user.save();
    return res.status(200).json({
        success: true,
        message: 'Token valid',
        token: user.tokens[0].token
    })
}

module.exports = {
    register,
    login,
    reset_token,
    longlifetoken
}
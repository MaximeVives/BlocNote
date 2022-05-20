let User = require('../../models/User');
let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config("../../.env");


async function VerifyToken(req, res, next){
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message: "No token provided"
        });
    }

    let token_unformatted = null;
    try {
        token_unformatted = jwt.verify(token, process.env.PRIVATE_KEY);
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid format token"
        });
    }

    if(token_unformatted == null){
        return res.status(401).json({
            message: "Invalid token"
        });
    }
    if (token_unformatted.die < Date.now() && !token_unformatted.infinite_token) {
        return res.status(401).json({
            message: "Token expired"
        });
    }
    return next();
}

async function GetUser(req, res,next){
    let token = req.headers.authorization;
    let token_unformatted = jwt.verify(token, process.env.PRIVATE_KEY);
    let user = await User.findOne({_id: token_unformatted._id});

    if(!user){
        return res.status(401).json({
            message: "User not found"
        });
    }
    req.user = user;
    return next();
}

module.exports = {
    VerifyToken,
    GetUser
}
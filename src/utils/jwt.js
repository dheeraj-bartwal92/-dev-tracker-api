const jwt = require("jsonwebtoken");

exports.generateAccessToken = (userId) => jwt.sign({sub: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES
})

exports.generateRefreshToken = (userId) => jwt.sign({sub: userId}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES
})
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

const expiresIn = '60 days'

export function generateAccessToken(userId: any) {
    dotenv.config();
    return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET, { expiresIn });
}
const dotenv = require('dotenv');
import jwt from 'jsonwebtoken';

export default function authenticateToken(req, res) {
    dotenv.config();
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) return 
        return decoded;
    })
    return decoded;
}
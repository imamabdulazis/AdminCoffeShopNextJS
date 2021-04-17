
const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../../lib/init-middleware';
import validateMiddleware from '../../../lib/validate-middleware';
import { check, validationResult } from 'express-validator';

const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 1, max: 40 }),
    check('description').isLength({ min: 4, max: 40 }),
    check('price').isLength({ min: 3, max: 40 }),
    ], validationResult)
)

export default async (req, res) => {
    const prisma = new PrismaClient()
    const image_url = process.env.DEFAULT_DRINK_IMAGE;
    switch (req.method) {
        case "POST":
            await validateBody(req,res)
            res.status(200).json({
                status:200,
                message:image_url
            })
            break;
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }
}
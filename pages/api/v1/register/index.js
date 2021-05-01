const dotenv = require('dotenv');
import { hash } from 'bcryptjs';
import initMiddleware from '../../helper/middleware';
import validateMiddleware from '../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
const { v4: uuid } = require('uuid');

const { PrismaClient } = require('@prisma/client');

const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 1, max: 40 }),
        check('username').isLength({ min: 4, max: 40 }),
        check('email').isEmail({ min: 6, mex: 40 }),
        check('password').isLength({ min: 4, max: 40 }),
        check('previlage').isLength({ min: 4, max: 40 }),
    ], validationResult)
)

export default async (req, res) => {
    dotenv.config();
    const prisma = new PrismaClient()
    const imageUrl = process.env.DEFAULT_IMAGE

    switch (req.method) {
        case "POST":
            await validateBody(req, res)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(422).json({
                    status: 422,
                    message: errors.array().map(e => `${e.param} tidak valid`),
                })
            }
            hash(req.body.password, 10, async function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: err
                    })
                } else {
                    const isNameExist = await prisma.users.findFirst({
                        where: { name: req.body.name },
                    })
                    const isUsernameExist = await prisma.users.findFirst({
                        where: { username: req.body.username },
                    })
                    const isEmailExist = await prisma.users.findFirst({
                        where: { email: req.body.email },
                    })
                    if (isNameExist != null || isUsernameExist != null || isEmailExist != null) {
                        return res.status(409).json({ status: 409, message: isNameExist != null ? 'Nama sudah terdaftar' : isUsernameExist != null ? 'Username sudah terdaftar' : 'Email sudah terdaftar' })
                    }

                    const newUser = await prisma.users.create({
                        data: {
                            id: uuid(),
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            image_url: imageUrl,
                            nomor_telp: req.body.nomor_telp,
                            previlage: req.body.previlage,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: new Date(),
                        }
                    });

                    if (!newUser) {
                        return res.status(403).json({
                            status: 403,
                            message: "Terjadi kesalahan"
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: `Berhasil register ${req.body.email}`,
                    })
                }
            })
            break;
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;

    }
}
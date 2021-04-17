const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../../lib/init-middleware';
import validateMiddleware from '../../../lib/validate-middleware';
import { check, validationResult } from 'express-validator';
import bcrypt, { hash } from 'bcryptjs';

const validateBody = initMiddleware(
    validateMiddleware([
        check('password').isLength({ min: 4, max: 40 }),
        check('new_password').isLength({ min: 4, max: 40 }),
        check('con_password').isLength({ min: 4, max: 40 }),
    ], validationResult)
)

export default async (req, res) => {
    const prisma = new PrismaClient()
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "PUT":
            try {
                await validateBody(req, res)
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: 422,
                        message: errors.array().map(e => `${e.param} tidak valid`),
                    })
                }
                 ///find user
                 const user = await prisma.users.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!user) return res.status(401).json({ status: 401, message: 'Username atau password salah' })

                const isValid = await bcrypt.compare(req.body.password, user.password);
                if (!isValid) return res.status(401).json({ status: 401, message: 'Username atau password salah' })

                ///validate if not same
                if(req.body.password==req.body.new_password){
                    return res.status(401).json({
                        status:401,
                        message:"Password baru tidak boleh sama dengan password lama"
                    })
                }

                if (req.body.new_password != req.body.con_password) {
                    return res.status(401).json({
                        status: 401,
                        message: "Konfirmasi password harus sama"
                    })
                }

                ///change password
                hash(req.body.con_password, 10, async function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            message: err
                        })
                    } else {
                        const user = await prisma.users.update({
                            where: {
                                id: id
                            },
                            data: {
                                password: hash
                            }
                        })
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil ganti password ${user.email}`
                        })
                    }
                })
            } catch (error) {
                res.status(500).json({
                    status: 500,
                    message: error
                })
            }
            break;
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }

}
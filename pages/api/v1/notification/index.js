require('dotenv').config();

const { v4: uuid } = require('uuid');
import initMiddleware from '@helper/middleware';
import validateMiddleware from '@helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';


const validateBody = initMiddleware(
    validateMiddleware([
        check('device_id').isLength({ min: 10, max: 40 }),
        check('title').isLength({ min: 3, max: 1000 }),
        check('body').isLength({ min: 3, max: 1000 }),
        check('event').isLength({ min: 4, max: 100 }),
    ], validationResult)
)



export default async (req, res) => {
    const {
        method,
    } = req;


    switch (method) {
        case "GET":
            try {
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const notification = await prisma.notification.findMany({
                    select: {
                        id: true,
                        device: {
                            select: {
                                id: true,
                                manufacture: true,
                                system_os: true,
                                phone_id: true,
                                app_version:true,
                                users: {
                                    select: {
                                        name: true,
                                    }
                                },
                            }
                        },
                        title: true,
                        body: true,
                        event: true,
                        created_at: true,
                        updated_at: true,
                        deleted_at: true,
                    }
                })

                if (!notification) return res.status(404).json({ status: 404, message: "Notifikasi tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: notification });

            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }

        case "POST":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                await validateBody(req, res)
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: 422,
                        message: errors.array().map(e => `${e.param} tidak valid`),
                    })
                }
                ///validat device
                const isExistDevice = await prisma.device.findUnique({
                    where: {
                        id: req.body.device_id
                    }
                })

                if (isExistDevice) {
                    const notification = await prisma.notification.create({
                        data: {
                            id: uuid(),
                            device_id: req.body.device_id,
                            title: req.body.title,
                            body: req.body.body,
                            event: req.body.event,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: new Date()
                        }
                    })
                    if (!notification) {
                        return res.status(403).json({
                            status: 403,
                            message: "Terjadi kesalahan"
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil menambahkan notification",
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "Gagal menambahkan notification",
                })

            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }

        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }
}
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
import initMiddleware from '../../helper/middleware';
import validateMiddleware from '../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../helper/autenticate_jwt'


const validateBody = initMiddleware(
    validateMiddleware([
        check('user_id').isLength({ min: 10, max: 40 }),
        check('fcm_token').isLength({ min: 10, max: 1000 }),
    ], validationResult)
)


export default async (req, res) => {
    const prisma = new PrismaClient();
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

                const device = await prisma.device.findMany({
                    select: {
                        id: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        fcm_token: true,
                        manufacture: true,
                        os_name: true,
                        phone_id: true,
                        system_os: true,
                        system_version: true,
                        app_version: true,
                        created_at: true,
                        deleted_at: true,
                        updated_at: true,
                    }
                })

                if (!device) return res.status(404).json({ status: 404, message: "Device tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: device })
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


                ///validate if userId not exist
                const isUserExist = await prisma.users.findUnique({
                    where: { id: req.body.user_id },
                })

                if (!isUserExist) return res.status(404).json({
                    status: 404,
                    message: "User tidak tersedia"
                })

                ///validate if device exist
                const isDeviceExist = await prisma.device.findFirst({
                    where: { phone_id: req.body.phone_id },
                })

                if (isDeviceExist) {
                    const device = await prisma.device.update({
                        where: {
                            id: isDeviceExist.id,
                        },
                        data: {
                            id: uuid(),
                            fcm_token: req.body.fcm_token,
                            app_version: req.body.app_version,
                            manufacture: req.body.manufacture,
                            system_version: req.body.system_version,
                            system_os: req.body.system_os,
                            updated_at: new Date(),
                        }
                    })
                    if (!device) {
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal menambahkan device"
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil update device",
                    })

                }
                const device = await prisma.device.create({
                    data: {
                        id: uuid(),
                        user_id: req.body.user_id,
                        fcm_token: req.body.fcm_token,
                        manufacture: req.body.manufacture,
                        system_version: req.body.system_version,
                        system_os: req.body.system_os,
                        phone_id: req.body.phone_id,
                        os_name: req.body.os_name,
                        app_version: req.body.app_version,
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: new Date()
                    }
                })
                if (!device) {
                    return res.status(403).json({
                        status: 403,
                        message: "Gagal menambahkan device"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil menambahkan device",
                })

            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }

        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }

}
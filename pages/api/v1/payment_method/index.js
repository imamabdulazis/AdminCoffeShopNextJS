require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
import initMiddleware from '../../../../lib/init-middleware';
import validateMiddleware from '../../../../lib/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../helper/autenticate_jwt'


const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 2, max: 40 }),
        check('method').isLength({ min: 2, max: 1000 }),
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

                const paymentMethod = await prisma.payment_method.findMany({})

                if (!paymentMethod) return res.status(404).json({ status: 404, message: "Metode pembayaran tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: paymentMethod })
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
                const isNameExist = await prisma.payment_method.findFirst({
                    where: { name: req.body.name },
                })
                if (isNameExist != null) {
                    return res.status(403).json({
                        status: 403,
                        message: "Nama metode pembayaran telah terdaftar"
                    })
                }
                const paymentMethod = await prisma.payment_method.create({
                    data: {
                        id: uuid(),
                        name: req.body.name,
                        method: req.body.method,
                        description: req.body.description,
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: new Date()
                    }
                })
                if (!paymentMethod) {
                    return res.status(403).json({
                        status: 403,
                        message: "Terjadi kesalahan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil menambahkan Metode Pembayaran",
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
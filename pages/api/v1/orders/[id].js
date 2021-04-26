require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../../../lib/init-middleware';
import validateMiddleware from '../../../../lib/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../helper/autenticate_jwt'


const validateBody = initMiddleware(
    validateMiddleware([
        check('user_id').isLength({ min: 10, max: 40 }),
        check('payment_method_id').isLength({ min: 10, max: 1000 }),
        check('drink_id').isLength({ min: 10, max: 1000 }),
        check('amount').isInt(),
        check('discount').isInt(),
        check('total').isInt(),
    ], validationResult)
)

export default async (req, res) => {
    const prisma = new PrismaClient();

    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "GET":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const orders = await prisma.orders.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!orders) {
                    return res.status(404).json({
                        status: 404,
                        message: "Pesanan tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: orders
                })
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }
        case "PUT":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                //validate tidak kosong
                await validateBody(req, res)
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: 422,
                        message: errors.array().map(e => `${e.param} tidak valid`),
                    })
                }

                //check if order exist
                const isOrderExist = await prisma.orders.findUnique({
                    where: {
                        id: id
                    }
                })

                if (!isOrderExist) return res.status(404).json({
                    status: 404,
                    message: "Pesanan tidak ditemukan"
                })

                //check user_id
                const isUserExist = await prisma.users.findUnique({
                    where: {
                        id: req.body.user_id
                    }
                })
                if (!isUserExist)
                    return res.status(404).json({
                        status: 404,
                        message: "User tidak ditemukan"
                    })

                // check drink
                const isDrinkExist = await prisma.drink.findUnique({
                    where: {
                        id: req.body.drink_id
                    }
                })
                if (!isDrinkExist) return res.status(404).json({
                    status: 404,
                    message: "Minuman tidak ditemukan"
                })

                // check payment method
                const isPaymentExist = await prisma.payment_method.findUnique({
                    where: {
                        id: req.body.payment_method_id,
                    }
                })

                if (!isPaymentExist) return res.status(404).json({
                    status: 404,
                    message: "Metode pembayaran tidak ditemukan"
                })

                // masuk order baru
                const updateOder = await prisma.orders.updateMany({
                    where: {
                        id: id
                    },
                    data: {
                        user_id: req.body.user_id,
                        drink_id: req.body.drink_id,
                        payment_method_id: req.body.payment_method_id,
                        pickup_date: req.body.pickup_date,
                        amount: req.body.amount,
                        total: req.body.total,
                        discount: req.body.discount,
                        updated_at: new Date(),
                    }
                })
                if (!updateOder) return res.status(403).json({
                    status: 403,
                    message: "Gagal update pesanan"
                })
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil update pesanan",
                    data: updateOder
                })
            } catch (e) {
                console.log(e)
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        case "DELETE":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const isNameExist = await prisma.orders.findUnique({
                    where: {
                        id: id
                    }
                })

                if (isNameExist) {
                    const orders = await prisma.orders.delete({
                        where: {
                            id: id
                        }
                    })

                    if (!orders) return res.status(404).json({
                        status: 404,
                        message: "Gagal hapus pesanan"
                    })

                    return res.status(200).json({
                        status: 200,
                        message: "Hapus berhasil"
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "Pesanan tidak ditemukan"
                })
            } catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: err
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }
}
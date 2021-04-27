require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');
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

                const order = await prisma.orders.findMany({})

                if (!order) return res.status(404).json({ status: 404, message: "Pesanan kosong tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: order })
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

                //validate tidak kosong
                await validateBody(req, res)
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: 422,
                        message: errors.array().map(e => `${e.param} tidak valid`),
                    })
                }

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

                // jike pesanan telah tersedia atas nama user_id
                const isUserOrerExist = await prisma.orders.findFirst({
                    where: {
                        user_id: req.body.user_id
                    }
                })
                if (isUserOrerExist) return res.status(409).json({
                    status: 409,
                    message: `Pesanan telah tersedia atas nama ${isUserExist.name}`
                })

                // masuk order baru
                const addOrder = await prisma.orders.create({
                    data: {
                        id: uuid(),
                        user_id: req.body.user_id,
                        drink_id: req.body.drink_id,
                        payment_method_id: req.body.payment_method_id,
                        pickup_date: req.body.pickup_date,
                        amount: req.body.amount,
                        total: req.body.total,
                        discount: req.body.discount,
                        created_at: new Date(),
                        deleted_at: new Date(),
                        updated_at: new Date(),
                    }
                })
                if (!addOrder) return res.status(403).json({
                    status: 403,
                    message: "Gagal menambahkan pesanan"
                })
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil membuat pesanan"
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
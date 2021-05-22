const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../../helper/middleware';
import validateMiddleware from '../../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../../helper/autenticate_jwt';
import { coreApi, parameterGopay } from '../../../../../midtrans';

const validateBody = initMiddleware(
    validateMiddleware([
        check('order_id').isLength({ min: 10, max: 40 }),
    ], validationResult)
)


export default async (req, res) => {
    const prisma = new PrismaClient()
    const {
        query: { id },
        method,
    } = req;

    switch (method) {

        case "POST":

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

            ///TODO
            const orders = await prisma.orders.findUnique({
                where: {
                    id: req.body.order_id,
                },
                select: {
                    id: true,
                    total: true,
                    users: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            telp_number: true,
                        }
                    },
                    drink: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            description: true,
                        }
                    }
                }
            })
            if (!orders) {
                return res.status(404).json({
                    status: 404,
                    message: "Pesanan tidak ditemukan"
                })
            }

            return coreApi.charge(parameterGopay(
                req.body.order_id,
                orders.total,
                orders.users.name,
                orders.users.email,
                orders.users.telp_number,
            ))
                .then((chargeResponse) => {
                    return res.status(200).json(chargeResponse)
                })
                .catch((e) => {
                    console.log(e)
                    return res.json(e)
                });;
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
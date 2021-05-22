
const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../../helper/autenticate_jwt'


export default async (req, res) => {
    const prisma = new PrismaClient();

    const {
        query: { id },
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

                const orderDrink = await prisma.orders.findMany({
                    where: {
                        user_id: id,
                    },
                    select: {
                        id: true,
                        no_transaction: true,
                        total: true,
                        amount: true,
                        pickup_date: true,
                        updated_at: true,
                        discount: true,
                        created_at: true,
                        deleted_at: true,
                        status: true,
                        payment_status: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        drink: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            }
                        },
                        payment_method: {
                            select: {
                                id: true,
                                payment_type: true,
                            }
                        },
                    }
                })

                if (!orderDrink) return res.status(404).json({ status: 404, message: "Pesanan tidak ditemukan" })

                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    length:orderDrink.length,
                    data: orderDrink
                })
            } catch (e) {
                console.log(e)
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
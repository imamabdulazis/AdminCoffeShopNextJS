import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';


export default async (req, res) => {
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
                    orderBy: {
                        updated_at: 'desc'
                    },
                    select: {
                        id: true,
                        no_transaction: true,
                        total: true,
                        amount: true,
                        discount: true,
                        payment_status: true,
                        order_status: true,
                        deeplink_redirect: true,
                        generate_qr_code: true,
                        get_status: true,
                        no_transaction: true,
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
                        updated_at: true,
                    }
                })

                if (!orderDrink) return res.status(404).json({ status: 404, message: "Pesanan tidak ditemukan" })

                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    length: orderDrink.length,
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
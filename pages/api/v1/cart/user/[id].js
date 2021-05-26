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

                const cart = await prisma.cart.findMany({
                    where: {
                        user_id: id
                    },
                    select: {
                        id: true,
                        amount: true,
                        user_id: true,
                        drink: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                image_url: true,
                                stock: true,
                                price: true,
                                updated_at: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                })

                if (!cart) return res.status(404).json({ status: 404, message: "Keranjang masih kosong" })

                return res.status(200).json({ status: 200, message: cart.length <= 0 ? "Keranjangmu masih kosong" : "Ok", data: cart, })
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
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

                const cartExist = await prisma.cart.findFirst({
                    where: {
                        user_id: id,
                        drink_id: req.body.drink_id,
                    }
                })

                if (!cartExist) {
                    return res.status(403).json({
                        status: 403,
                        message: "Minuman tidak di temukan"
                    })
                }

                const cart = await prisma.cart.updateMany({
                    where: {
                        user_id: id,
                        drink_id: req.body.drink_id,
                    },
                    data: {
                        amount: req.body.amount,
                    }
                })

                if (!cart) {
                    return res.status(403).json({
                        status: 403,
                        message: "Gagal update keranjang"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil update keranjang",
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

                const cart = await prisma.cart.findFirst({
                    where: {
                        user_id: id,
                        drink_id: req.body.drink_id,
                    }
                })
                if (!cart) {
                    return res.status(403).json({
                        status: 403,
                        message: "Minuman tidak di temukan"
                    })
                }
                const cartDelete = await prisma.cart.delete({
                    where: {
                        id: cart.id,
                    }
                })

                if (!cartDelete) {
                    return res.status(403).json({
                        status: 403,
                        message: "Gagal hapus Minuman keranjang"
                    })
                }

                return res.status(200).json({
                    status: 200,
                    message: "Berhasil hapus minuman dari keranjang",
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
const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../../helper/autenticate_jwt';

export default async (req, res) => {
    const prisma = new PrismaClient()
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

                const drink = await prisma.drink.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        image_url: true,
                        price: true,
                        stock: true,
                        updated_at: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                    orderBy: {
                        updated_at: 'asc'
                    },
                    where: {
                        category_id: id,
                    }
                })

                if (!drink) return res.status(404).json({ status: 404, message: "Minuman tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: drink })
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }
}
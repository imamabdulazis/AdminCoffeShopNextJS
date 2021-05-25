const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../../helper/autenticate_jwt';

export default async (req, res) => {
    const prisma = new PrismaClient()
    const {
        method,
    } = req;
    switch (method) {
        case "PUT":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const isExist = await prisma.drink.findUnique({
                    where: {
                        id: req.body.drink_id,
                    }
                })

                if (isExist) {
                    const drink = await prisma.drink.update({
                        where: {
                            id: req.body.drink_id,
                        },
                        data: {
                            category_id: req.body.category_id,
                            updated_at: new Date(),
                        }
                    })
                    if (!drink) {
                        return res.status(403).json({
                            status: 404,
                            message: "Gagal update minuman",
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Update berhasil",
                        data: drink,
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "Minuman tidak ditemukan",
                })
            } catch (error) {
                console.log(error)
                if (error.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "Minuman tidak ditemukan",
                    })
                }
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}

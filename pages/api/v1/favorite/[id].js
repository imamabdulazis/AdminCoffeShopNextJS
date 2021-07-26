
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

                const favorite = await prisma.favorite.findMany({
                    where: {
                        user_id: id
                    },
                    select: {
                        id: true,
                        amount: true,
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

                if (!favorite) return res.status(404).json({ status: 404, message: "Keranjang masih kosong" })

                return res.status(200).json({ status: 200, message: favorite.length <= 0 ? "Favoritmu masih kosong" : "Ok", data: favorite, })
            } catch (e) {
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
                
                const favorite = await prisma.favorite.deleteMany({
                    where: {
                        user_id: id,
                        drink_id: req.body.drink_id,
                    }
                })
                if (!favorite) {
                    return res.status(403).json({
                        status: 403,
                        message: "Gagal hapus favorite"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil hapus favorite",
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
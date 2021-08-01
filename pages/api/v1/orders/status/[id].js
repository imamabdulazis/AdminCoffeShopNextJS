import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';

export default async (req, res) => {

    const {
        query: { id },
        method,
    } = req;


    return new Promise(async (resolve) => {
        switch (method) {
            case "PUT":
                try {
                    //validate jwt token
                    const isAuth = authenticateToken(req, res)
                    if (!isAuth) return res.status(401).json({
                        status: 401,
                        message: "Token expired"
                    })

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

                    // masuk order baru
                    const updateOder = await prisma.orders.updateMany({
                        where: {
                            id: id
                        },
                        data: {
                            order_status: req.body.order_status,
                            updated_at: new Date(),
                        }
                    })
                    if (!updateOder) {
                        res.status(403).json({
                            status: 403,
                            message: "Gagal update pesanan"
                        })
                        return resolve;
                    }
                    res.status(200).json({
                        status: 200,
                        message: "Berhasil update pesanan",
                    })
                    return resolve;
                } catch (e) {
                    console.log(e)
                    return res.status(500).json({
                        status: 500,
                        message: e
                    })
                }
            default:
                res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
                return resolve;
        }
    });
}
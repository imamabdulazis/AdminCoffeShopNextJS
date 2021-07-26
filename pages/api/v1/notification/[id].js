
import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';


export default async (req, res) => {
    const {
        query: { id },
        method,
    } = req;


    switch (method) {
        case "DELETE":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const notification = await prisma.notification.delete({
                    where: {
                        id: id
                    }
                })

                if (!notification) return res.status(404).json({
                    status: 404,
                    message: "Gagal hapus notifikasi"
                })

                return res.status(200).json({
                    status: 200,
                    message: "Hapus berhasil"
                })
            } catch (err) {
                if (err.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "Notifikasi tidak ditemukan",
                    })
                }
                return res.status(500).json({
                    status: 500,
                    message: err
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }
}
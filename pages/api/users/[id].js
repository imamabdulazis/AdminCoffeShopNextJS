const { PrismaClient } = require('@prisma/client');


export default async (req, res) => {
    const prisma = new PrismaClient()
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "GET":
            try {
                const user = await prisma.users.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!user) {
                    res.status(404).json({
                        status: 404,
                        message: "User tidak ditemukan"
                    })
                }
                res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: user
                })
            } catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Internal Server Error"
                })
            }
            break;
        case "PUT":
            try {
                const user = await prisma.users.update({
                    where: {
                        id: id
                    },
                    data: {
                        name: req.body.name,
                        username:req.body.username,
                        email: req.body.email,
                        image_url: req.body.image_url,
                        nomor_telp: req.body.telp_number,
                        updated_at: new Date()
                    }
                })
                res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: user,
                })
            } catch (error) {
                res.status(500).json({
                    status: 500,
                    message: error
                })
            }
            break;
        case "DELETE":
            try {
                const user = await prisma.users.delete({
                    where: {
                        id: id
                    }
                })

                if (!user) res.status(404).json({ status: 404, message: "Gagal delete user" })

                res.status(200).json({ status: 200, message: "Hapus berhasil" })

            } catch (error) {
                res.status(500).json({
                    status: 500,
                    message: error
                })
            }
            break;
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }
}
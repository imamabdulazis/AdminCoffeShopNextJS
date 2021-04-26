const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../helper/autenticate_jwt'



export default async (req, res) => {
    const prisma = new PrismaClient();

    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "GET":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const category = await prisma.category.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!category) {
                    return res.status(404).json({
                        status: 404,
                        message: "Kategori tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: category
                })
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
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

                const isExist = await prisma.category.findUnique({
                    where: {
                        id: id,
                    }
                })

                if (isExist) {
                    const category = await prisma.category.update({
                        where: {
                            id: id
                        },
                        data: {
                            name: req.body.name,
                            description: req.body.description,
                            updated_at: new Date()
                        }
                    })
                    if (!category) {
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal update kategori",
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Update Berhasil",
                        data: category,
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "Kategori tidak ditemukan",
                })
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
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

                const isNameExist = await prisma.category.findUnique({
                    where: {
                        id: id
                    }
                })

                if (isNameExist) {
                    const category = await prisma.category.delete({
                        where: {
                            id: id
                        }
                    })

                    if (!category) return res.status(404).json({
                        status: 404,
                        message: "Gagal hapus category"
                    })

                    return res.status(200).json({
                        status: 200,
                        message: "Hapus berhasil"
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "Gagal hapus category"
                })
            } catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: err
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
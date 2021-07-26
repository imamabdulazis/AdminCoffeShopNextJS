
const { uploadImageToStorage } = require('@helper/uploader');
import authenticateToken from '@helper/autenticate_jwt'
import multer from 'multer';
import initMiddleware from '@helper/middleware';
import prisma from '@utils/prisma';

export default async (req, res) => {
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

                const drink = await prisma.drink.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        name:true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        description: true,
                        image_url: true,
                        price: true,
                        stock: true,
                        updated_at:true,
                    }
                })
                if (!drink) {
                    return res.status(404).json({
                        status: 404,
                        message: "Minuman tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: drink
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

                const isExist = await prisma.drink.findUnique({
                    where: {
                        id: id,
                    }
                })

                if (isExist) {
                    const drink = await prisma.drink.update({
                        where: {
                            id: id
                        },
                        data: {
                            name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                            image_url: req.body.image_url != null ? req.body.image_url : isExist.image_url,
                            stock: req.body.stock,
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
        case "DELETE":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const drink = await prisma.drink.delete({
                    where: {
                        id: id
                    }
                })

                if (!drink) return res.status(404).json({
                    status: 404,
                    message: "Gagal hapus minuman"
                })

                return res.status(200).json({
                    status: 200,
                    message: "Hapus berhasil"
                })
            } catch (err) {
                if (err.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "Minuman tidak ditemukan",
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
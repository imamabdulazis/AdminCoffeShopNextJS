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

                const user = await prisma.users.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        previlage: true,
                        telp_number: true,
                        image_url: true,
                        created_at: true,
                        updated_at: true,
                    }
                })
                if (!user) {
                    return res.status(404).json({
                        status: 404,
                        message: "User tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: user
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

                const isExist = await prisma.users.findUnique({
                    where: {
                        id: id,
                    }
                })


                if (isExist) {
                    const user = await prisma.users.update({
                        where: {
                            id: id
                        },
                        data: {
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            telp_number: req.body.telp_number,
                            previlage: req.body.previlage,
                            updated_at: new Date()
                        }
                    })
                    if (!user) {
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal update user",
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Update berhasil",
                        data: user,
                    })
                }
                return res.status(404).json({
                    status: 404,
                    message: "User tidak ditemukan",
                })
            } catch (error) {
                console.log(error);
                if (error.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "User tidak ditemukan",
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
                const user = await prisma.users.delete({
                    where: {
                        id: id
                    }
                })

                if (!user) return res.status(404).json({
                    status: 404,
                    message: "Gagal delete user"
                })

                return res.status(200).json({
                    status: 200,
                    message: "Hapus berhasil"
                })

            } catch (error) {
                if (error.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "User tidak ditemukan",
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
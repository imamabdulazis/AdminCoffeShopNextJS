const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../helper/autenticate_jwt'
import { IncomingForm } from 'formidable'
var util = require('util');
const { uploadImageToStorage } = require('../../helper/uploader');

export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req, res) => {
    const prisma = new PrismaClient()
    const form = new IncomingForm()
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "PATCH":
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
                    }
                })
                if (!user) return res.status(404).json({
                    status: 404,
                    message: "User tidak ditemukan"
                })
                form.parse(req, (err, fields, files) => {
                    // res.writeHead(200, { 'content-type': 'text/plain' });
                    // res.write('received upload:\n\n');
                    // res.end(util.inspect({ fields: fields, files: files.file.path }));
                    uploadImageToStorage(files.file).then(success => {
                        return res.status(200).json({
                            status: 200,
                            message: req.success
                        })
                    }).catch(error => {
                        return res.status(500).json({
                            status: 500,
                            message: error
                        })
                        console.log(error)
                    })
                })
                return

            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }
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
                            image_url: req.body.image_url,
                            telp_number: req.body.telp_number,
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
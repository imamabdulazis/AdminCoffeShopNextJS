const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../helper/autenticate_jwt'
import { IncomingForm } from 'formidable'
var util = require('util');
const { uploadImageToStorage } = require('../../helper/uploader');





export default async (req, res) => {
    const prisma = new PrismaClient()
    const form = new IncomingForm()
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

                const device = await prisma.devices.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!device) {
                    return res.status(404).json({
                        status: 404,
                        message: "Device tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: device
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
                const device = await prisma.device.delete({
                    where: {
                        id: id
                    }
                })

                if (!device) return res.status(404).json({
                    status: 404,
                    message: "Gagal delete device"
                })

                return res.status(200).json({
                    status: 200,
                    message: "Hapus berhasil"
                })

            } catch (error) {
                if (error.code == "P2025") {
                    return res.status(404).json({
                        status: 404,
                        message: "Device tidak ditemukan",
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
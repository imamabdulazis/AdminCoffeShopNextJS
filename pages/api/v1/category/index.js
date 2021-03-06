require('dotenv').config();

import initMiddleware from '@helper/middleware';
import validateMiddleware from '@helper/validate-middleware';
import { check, validationResult } from 'express-validator';
const { v4: uuid } = require('uuid');
import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';


const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 1, max: 40 }),
        check('description').isLength({ min: 4 }),
    ], validationResult)
)

export default async (req, res) => {
    switch (req.method) {
        case "GET":  //validate jwt token
            const isAuth = authenticateToken(req, res)
            if (!isAuth) return res.status(401).json({
                status: 401,
                message: "Token expired"
            })

            const category = await prisma.category.findMany({
                orderBy:{
                    updated_at: 'desc'
                },
            })
            if (!category) return res.status(404).json({ status: 404, message: "Kategori tidak ditemukan" })
            return res.status(200).json({ status: 200, message: "Ok", data: category })

        case "POST":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                await validateBody(req, res)
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: 422,
                        message: errors.array().map(e => `${e.param} tidak valid`),
                    })
                }
                const isNameExist = await prisma.category.findFirst({
                    where: { name: req.body.name },
                })
                if (isNameExist != null) {
                    return res.status(403).json({
                        status: 403,
                        message: "Nama telah terdaftar"
                    })
                }
                const category = await prisma.category.create({
                    data: {
                        id: uuid(),
                        name: req.body.name,
                        description: req.body.description,
                        created_at: new Date(),
                        updated_at: new Date(),
                        
                    }
                })
                if (!category) {
                    return res.status(403).json({
                        status: 403,
                        message: "Terjadi kesalahan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil menambahkan kategori",
                })
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
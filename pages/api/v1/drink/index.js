require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../helper/middleware';
import validateMiddleware from '../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../helper/autenticate_jwt';
const { v4: uuid } = require('uuid');


const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 1, max: 40 }),
        check('description').isLength({ min: 4 }),
        check('stock').isLength({ min: 1, max: 40 }),
        check('price').isLength({ min: 3, max: 40 }),
    ], validationResult)
)

export default async (req, res) => {
    const prisma = new PrismaClient()
    const image_url = process.env.DEFAULT_DRINK_IMAGE;
    switch (req.method) {
        case "POST":
            try {
                const stock = 1;
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
                } else {
                    const isNameExist = await prisma.drink.findFirst({
                        where: { name: req.body.name },
                    })

                    if (isNameExist != null) {
                        const drink = await prisma.drink.update({
                            where: {
                                id: isNameExist.id
                            },
                            data: {
                                stock: isNameExist.stock + req.body.stock,
                                updated_at: new Date()
                            }
                        })
                        if (drink) {
                            return res.status(200).json({
                                status: 200,
                                message: "Minuman telah tersedia, maka stock bertambah",
                            })
                        }
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal input data"
                        })
                    }

                    ///find category name
                    const category = await prisma.category.findMany({
                    })
                    if (!category) {
                        return res.status(404).json({
                            status: 404,
                            message: "Kategori tidak di temukan"
                        })
                    }

                    ///add drink to database
                    const drink = await prisma.drink.create({
                        data: {
                            id: uuid(),
                            name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                            image_url: image_url,
                            stock: stock,
                            category_id: category[0].id,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: new Date()
                        }
                    })
                    if (!drink) {
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal tambah minuman"
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil tambah minuman"
                    })
                }
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }

        case "GET":
            try {
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const drink = await prisma.drink.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        image_url: true,
                        price: true,
                        stock: true,
                        updated_at: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                    orderBy: {
                        updated_at: 'desc'
                    }
                })

                if (!drink) return res.status(404).json({ status: 404, message: "Minuman tidak ditemukan" })

                return res.status(200).json({ status: 200, message: "Ok", data: drink })
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }
}
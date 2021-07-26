
const { v4: uuid } = require('uuid');
import initMiddleware from '@helper/middleware';
import validateMiddleware from '@helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';


const validateBody = initMiddleware(
    validateMiddleware([
        check('user_id').isLength({ min: 10, max: 40 }),
        check('drink_id').isLength({ min: 10, max: 40 }),
    ], validationResult)
)


export default async (req, res) => {
    const {
        method,
    } = req;

    switch (method) {
        case "GET":
            try {
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const favorite = await prisma.favorite.findMany({
                    select: {
                        id: true,
                        amount:true,
                        drink: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                image_url: true,
                                stock: true,
                                price: true,
                                updated_at: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                })

                if (!favorite) return res.status(404).json({ status: 404, message: "Favorite masih kosong" })

                return res.status(200).json({ status: 200, message: "Ok", data: favorite, })
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }

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

                ///validate if userId not exist
                const isUserExist = await prisma.users.findUnique({
                    where: { id: req.body.user_id },
                })

                if (!isUserExist) return res.status(404).json({
                    status: 404,
                    message: "User tidak tersedia"
                })

                ///validate if device exist
                const isFavoriteDrinkExist = await prisma.favorite.findFirst({
                    where: { drink_id: req.body.drink_id },
                })

                if (isFavoriteDrinkExist) {

                    const favorite = await prisma.favorite.update({
                        where: {
                            id: isFavoriteDrinkExist.id,
                        },
                        data: {
                            id: uuid(),
                            amount: isFavoriteDrinkExist.amount + 1,
                            updated_at: new Date(),
                        }
                    })
                    if (!favorite) {
                        return res.status(403).json({
                            status: 403,
                            message: "Gagal menambahkan favorite"
                        })
                    }

                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil menambahkan ke favorite",
                    })

                }
                const favorite = await prisma.favorite.create({
                    data: {
                        id: uuid(),
                        user_id: req.body.user_id,
                        drink_id: req.body.drink_id,
                        amount: 1,
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: new Date()
                    }
                })
                if (!favorite) {
                    return res.status(403).json({
                        status: 403,
                        message: "Gagal menambahkan favorite"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil menambahkan favorite",
                })

            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }

        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }

}
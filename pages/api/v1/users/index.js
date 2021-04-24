const { PrismaClient } = require('@prisma/client');
import authenticateToken from '../../helper/autenticate_jwt'

const handler = async (req, res) => {
    const prisma = new PrismaClient()

    switch (req.method) {
        case "GET":

            //validate jwt token
            const isAuth = authenticateToken(req, res)
            if (!isAuth) return res.status(401).json({
                status: 401,
                message: "Token expired"
            })

            const users = await prisma.users.findMany({})

            if (!users) return res.status(404).json({ status: 404, message: "User tidak ditemukan" })
            return res.status(200).json({ status: 200, message: "Ok", data: users })
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}

export default handler


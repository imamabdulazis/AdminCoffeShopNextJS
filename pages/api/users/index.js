
const { PrismaClient } = require('@prisma/client');

export default async (req, res) => {
    const prisma = new PrismaClient()
    switch (req.method) {
        case "GET":
            const users = await prisma.users.findMany({})
            if (!users) return res.status(404).json({ status: 404, message: "User tidak ditemukan" })
            res.status(200).json({ status: 200, message: "Ok",data:users })
            break;
        default:
            res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
            break;
    }
}
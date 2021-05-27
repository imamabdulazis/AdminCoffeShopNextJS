
import authenticateToken from '../../helper/autenticate_jwt'
import prisma from '../../utils/prisma';

export default async (req, res) => {
    switch (req.method) {
        case "GET":

            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const users = await prisma.users.findMany({
                    orderBy:{
                        updated_at: 'desc'
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
                        deleted_at: true,
                        updated_at: true,
                    }
                })

                if (!users) return res.status(404).json({ status: 404, message: "User tidak ditemukan" })
                return res.status(200).json({ status: 200, message: "Ok", data: users })
            } catch (e) {
                console.log(e);
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}



import authenticateToken from '@helper/autenticate_jwt'
import prisma from '@utils/prisma';



export default async (req, res) => {

    const { method } = req;


    switch (method) {
        case "POST":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                const findDrink = await prisma.drink.findMany({
                    where: {
                        name: {
                            contains: req.body.name.toLowerCase(),
                            mode: "insensitive"
                        }
                    },
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
                        updated_at: 'asc'
                    },
                })

                if (!findDrink) {
                    return res.status(404).json({
                        status: 404,
                        message: "Minuman tidak ditemukan"
                    })
                }
                return res.status(200).json({
                    status: 200,
                    message: "Ok",
                    data: findDrink,
                })

            } catch (e) {
                console.log(e);
                return res.status(500).json({
                    status: 500,
                    message: e
                });
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }

}
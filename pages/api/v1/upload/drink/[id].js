const { uploadImageToStorage } = require('../../../helper/uploader');
import authenticateToken from '../../../helper/autenticate_jwt'
import multer from 'multer';
import initMiddleware from '../../../helper/middleware';
import prisma from '../../../utils/prisma';

const upload = multer();

// untuk parsing multipart/form-data
// note that Multer limits to 1MB dari ukuran default
const multerAny = initMiddleware(
    upload.any(),
);

export const config = {
    api: {
        bodyParser: false,
    }
};

export default async(req, res) => {
    await multerAny(req, res);

    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "PUT":
            try {
                //validate jwt token
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })
                const drink = await prisma.drink.findUnique({
                    where: {
                        id: id
                    }
                })
                if (!drink) return res.status(404).json({
                    status: 404,
                    message: "Minuman tidak ditemukan"
                })
                const blob = req.files[0];

                ///upload image
                return uploadImageToStorage(blob).then(async function(success) {
                    const drink = await prisma.drink.update({
                        where: {
                            id: id,
                        },
                        data: {
                            image_url: success,
                        }
                    })
                    if (!drink) {
                        return res.status(403).json({
                            status: 403,
                            message: "Terjadi kesalahan"
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil update foto minuman"
                    })
                });
            } catch (error) {
                console.info(`GAGAL :${error}`)
                return res.status(500).json({
                    status: 500,
                    message: error
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
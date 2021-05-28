const dotenv = require('dotenv');
const { v4: uuid } = require('uuid');
var handlebars = require('handlebars');
var path = require('path');
import { hash } from 'bcryptjs';
import initMiddleware from '../../helper/middleware';
import validateMiddleware from '../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import { readHTMLFile, smtpTransport } from '../../helper/email';
import prisma from '../../utils/prisma';

const validateBody = initMiddleware(
    validateMiddleware([
        check('name').isLength({ min: 1, max: 40 }),
        check('username').isLength({ min: 4, max: 40 }),
        check('email').isEmail({ min: 6, mex: 40 }),
        check('password').isLength({ min: 4, max: 40 }),
        check('previlage').isLength({ min: 4, max: 40 }),
    ], validationResult)
)

export default async (req, res) => {
    dotenv.config();
    const imageUrl = process.env.DEFAULT_IMAGE

    return new Promise(async (resolve) => {        switch (req.method) {
            case "POST":
                try {
                    await validateBody(req, res)
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) {
                        res.status(422).json({
                            status: 422,
                            message: errors.array().map(e => `${e.param} tidak valid`),
                        })
                    }
                    const hashed = await hash(req.body.password, 10);

                    const isNameExist = await prisma.users.findFirst({
                        where: { name: req.body.name },
                    })

                    const isUsernameExist = await prisma.users.findFirst({
                        where: { username: req.body.username },
                    })

                    const isEmailExist = await prisma.users.findFirst({
                        where: { email: req.body.email },
                    })

                    if (isNameExist != null || isUsernameExist != null || isEmailExist != null) {
                        return res.status(409).json({ status: 409, message: isNameExist != null ? 'Nama sudah terdaftar' : isUsernameExist != null ? 'Username sudah terdaftar' : 'Email sudah terdaftar' })
                    }

                    const newUser = await prisma.users.create({
                        data: {
                            id: uuid(),
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            password: hashed,
                            image_url: imageUrl,
                            telp_number: req.body.telp_number,
                            previlage: req.body.previlage,
                            created_at: new Date(),
                            updated_at: new Date(),
                            deleted_at: new Date(),
                        }
                    });

                    if (!newUser) {
                        return res.status(403).json({
                            status: 403,
                            message: "Terjadi kesalahan"
                        })
                    }
                    const postsDirectory = path.join(process.cwd(), '/pages/api/helper/email.html')

                    return readHTMLFile(postsDirectory, function(err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            username: "Default Username"
                        };
                        var htmlToSend = template(replacements);
                        var mailOptions = {
                            from: 'imamnurohmat21@gmail.com',
                            to: req.body.email,
                            subject: 'Pendaftaran Copsychus Coffe',
                            html: htmlToSend
                        };
                        return smtpTransport.sendMail(mailOptions, function(error, response) {
                            if (error) {
                                res.status(500).json({
                                    status: 500,
                                    message: error
                                })
                                return resolve;
                            } else {
                                res.status(200).json({
                                    status: 200,
                                    message: `Berhasil register ${req.body.email}`,
                                })
                                return resolve;
                            }
                        });
                    });
                } catch (e) {
                    res.status(500).json({
                        status: 500,
                        message: e
                    })
                    return resolve;

                }
                break;
            default:
                res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
                return resolve;
        }
    })
}
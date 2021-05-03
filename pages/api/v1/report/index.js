require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../helper/middleware';
import validateMiddleware from '../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
const { v4: uuid } = require('uuid');
import authenticateToken from '../../helper/autenticate_jwt'


export default async (req, res) => {
    const prisma = new PrismaClient()

    switch (req.method) {
        case "GET":
            //validate jwt token
            const isAuth = authenticateToken(req, res)
            if (!isAuth) return res.status(401).json({
                status: 401,
                message: "Token expired"
            })

            const report = await prisma.report.findMany({})
            if (!report) return res.status(404).json({ status: 404, message: "Laporan tidak ditemukan tidak ditemukan" })
            return res.status(200).json({ status: 200, message: "Ok", data: report })

        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
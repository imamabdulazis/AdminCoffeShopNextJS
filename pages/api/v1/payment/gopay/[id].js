
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
import initMiddleware from '../../../helper/middleware';
import validateMiddleware from '../../../helper/validate-middleware';
import { check, validationResult } from 'express-validator';
import authenticateToken from '../../../helper/autenticate_jwt';
import moment from 'moment';
import { coreApi } from '../../../../../midtrans';


export default async (req, res) => {
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "GET":
            return coreApi.transaction.status(id).then((responseStatus) => {
                return res.status(200).json(responseStatus);
            }).catch((e) => {
                return res.status(500).json(e)
            });
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    
    }
}
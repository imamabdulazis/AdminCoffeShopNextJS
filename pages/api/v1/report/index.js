require("dotenv").config();

import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
const { v4: uuid } = require("uuid");
import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
// import prisma from '@utils/prisma';

export default async (req, res) => {
  const prisma = new PrismaClient();
  switch (req.method) {
    case "POST":
      try {
        //validate jwt token
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

          console.log(req.body);

        const report = await prisma.report.findMany({
          where: {
            created_at: {
              gte: req.body.start_date,
              lt: req.body.end_date,
            },
          },
          select: {
            orders: {
              select: {
                id: true,
                no_transaction: true,
                users: true,
                order_items: true,
              },
            },
            date_report: true,
            updated_at: true,
          },
        });
        if (!report)
          return res.status(404).json({
            status: 404,
            message: "Laporan tidak ditemukan tidak ditemukan",
          });
        return res
          .status(200)
          .json({ status: 200, message: "Ok", data: report });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 500,
          message: e,
        });
      }
    default:
      return res
        .status(405)
        .json({ status: 405, message: "Request method tidak di izinkan" });
  }
};

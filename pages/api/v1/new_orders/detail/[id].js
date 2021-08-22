const { v4: uuid } = require("uuid");
import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import prisma from "@utils/prisma";

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  // const prisma = new PrismaClient();

  switch (method) {
    case "GET":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        const detailOrder = await prisma.orders.findUnique({
          where: {
            id: id,
          },
          select: {
            id: true,
            order_items: {
              select: {
                id: true,
                quantity: true,
                drink: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    image_url: true,
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            no_transaction: true,
            payment_method: true,
            pickup_date: true,
            status: true,
            payment_status: true,
            total: true,
            users: true,
            transaction_token: true,
            deeplink_redirect: true,
            generate_qrcode: true,
            get_status_order: true,
            post_cancel_order: true,
            created_at: true,
            updated_at: true,
          },
        });
        if (!detailOrder)
          return res
            .status(404)
            .json({ status: 404, message: "Order tidak tersedia" });

        return res
          .status(200)
          .json({ status: 200, message: "Ok", data: detailOrder });
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

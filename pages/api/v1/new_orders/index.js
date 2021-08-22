const { v4: uuid } = require("uuid");
import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import prisma from "@utils/prisma";

export default async (req, res) => {
  const { method } = req;
  // const prisma = new PrismaClient();

  switch (method) {
    case "POST":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        //cek user memiliki keranjang
        const isCartExist = await prisma.cart.findUnique({
          where: {
            id: req.body.cart_id,
          },
        });

        //jika user memilki krnjang
        if (isCartExist) {
          const orders = await prisma.orders.create({
            data: {
              id: uuid(),
              no_transaction: `${moment(Date.now()).format("HHmmMMSS")}`,
              user_id: req.body.user_id,
              payment_method_id: req.body.payment_method_id,
              payment_status: "Pending",
              status: "Proses",
              total: req.body.total,
              pickup_date: new Date(),
              created_at: new Date(),
              updated_at: new Date(),
            },
            select: {
              id: true,
              no_transaction: true,
              payment_method: true,
              total: true,
              created_at: true,
              updated_at: true,
            },
          });
          const addOrderItems = await prisma.order_items.createMany({
            data: req.body.drinks.map((drink) => ({
              id: uuid(),
              order_id: orders.id,
              drink_id: drink.id,
              quantity: drink.quantity,
              created_at: new Date(),
              updated_at: new Date(),
            })),
            skipDuplicates: true,
          });

          if (addOrderItems) {
            const updateDinks = req.body.drinks.map(async (drink) => {
              const curDrink = await prisma.drink.findUnique({
                where: {
                  id: drink.id,
                },
              });
              return await prisma.drink.update({
                where: {
                  id: curDrink.id,
                },
                data: {
                  stock:
                    curDrink.stock - drink.quantity < 0
                      ? 0
                      : curDrink.stock - drink.quantity,
                },
              });
            });

            const deleteCartItems = await prisma.cart_items.deleteMany({
              where: {
                drink_id: { in: req.body.drinks.map(({ id }) => id) },
              },
            });
            ///berhasil orders
            if (updateDinks && deleteCartItems)
              return res.status(200).json({
                status: 200,
                message: "Berhasil membuat pesanan",
                data: orders,
              });
            //gagal orders
            return res.status(403).json({
              status: 403,
              message: "Gagal membuat pesanan",
            });
          }
          return res.status(403).json({
            status: 403,
            message: "Gagal membuat pesanan",
          });
        }
        return res.status(404).json({
          status: 404,
          message: "Keranjang kosong",
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 500,
          message: e,
        });
      }
    case "GET":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        const allOrder = await prisma.orders.findMany({
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

        if (!allOrder)
          return res
            .status(404)
            .json({ status: 404, message: "Pesanan masih kosong" });

        return res
          .status(200)
          .json({ status: 200, message: "WOYY", data: allOrder });
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

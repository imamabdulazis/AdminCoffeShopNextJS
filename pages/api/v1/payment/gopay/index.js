import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
import authenticateToken from "@helper/autenticate_jwt";
import { coreApi, parameterGopay } from "../../../../../midtrans";
import { PrismaClient } from "@prisma/client";
import prisma from '@utils/prisma';

export default async (req, res) => {
  // const prisma=new PrismaClient();
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        //validate jwt token
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        const findOrders = await prisma.orders.findFirst({
          where: {
            id: req.body.order_id,
          },
          select: {
            id: true,
            total: true,
            users: {
              select: {
                name: true,
                email: true,
                telp_number: true,
              },
            },
            deeplink_redirect: true,
          },
        });

        if (findOrders.deeplink_redirect != null) {
          const findOrder = await prisma.orders.findFirst({
            where: {
              id: findOrders.id,
            },
            select: {
              id: true,
              deeplink_redirect: true,
              generate_qrcode: true,
              get_status_order: true,
              no_transaction: true,
              total: true,
              payment_method: {
                select: {
                  id: true,
                  payment_type: true,
                },
              },
            },
          });
          return res.status(200).json({
            status: 200,
            message: "Berhasil membuat transaksi gopay",
            data: findOrder,
          });
        }

        return coreApi
          .charge(
            parameterGopay(
              findOrders.id,
              findOrders.total,
              findOrders.users.name,
              findOrders.users.email,
              findOrders.users.telp_number,
              req.body.callback_url
            )
          )
          .then(async (chargeResponse) => {
            var actions = chargeResponse.actions;
            var deeplink_redirect;
            var generate_qrcode;
            var get_status_order;
            var post_cancel_order;

            for (var i = 0; i < actions.length; i++) {
              if (actions[i].name == "generate-qr-code") {
                generate_qrcode = actions[i].url;
              } else if (actions[i].name == "deeplink-redirect") {
                deeplink_redirect = actions[i].url;
              } else if (actions[i].name == "get-status") {
                get_status_order = actions[i].url;
              } else {
                post_cancel_order = actions[i].url;
              }
            }

            const ordersUpdate = await prisma.orders.updateMany({
              where: {
                id: findOrders.id,
              },
              data: {
                deeplink_redirect: deeplink_redirect,
                generate_qrcode: generate_qrcode,
                get_status_order: get_status_order,
                post_cancel_order: post_cancel_order,
              },
            });

            if (!ordersUpdate) {
              return res.status(404).json({
                status: 404,
                message: "Pesanan tidak ditemukan",
              });
            }

            const findOrder = await prisma.orders.findFirst({
              where: {
                id: findOrders.id,
              },
              select: {
                id: true,
                deeplink_redirect: true,
                generate_qrcode: true,
                get_status_order: true,
                no_transaction: true,
                total: true,
                payment_method: {
                  select: {
                    id: true,
                    payment_type: true,
                  },
                },
              },
            });
            return res.status(200).json({
              status: 200,
              message: "Berhasil membuat transaksi gopay",
              data: findOrder,
            });
          })
          .catch((e) => {
            console.log(e);
            return res.json(e);
          });
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

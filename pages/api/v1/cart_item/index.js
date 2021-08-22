const { v4: uuid } = require("uuid");
import initMiddleware from "@helper/middleware";
import validateMiddleware from "@helper/validate-middleware";
import { check, validationResult } from "express-validator";
import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
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

        const isCartExist = await prisma.cart.findFirst({
          where: {
            user_id: req.body.user_id,
          },
        });

        if (isCartExist) {
          const isDrinkExist = await prisma.cart_items.findFirst({
            where: {
              drink_id: req.body.drink_id,
              cart_id: isCartExist.id,
            },
          });

          
          if (isDrinkExist) {
            await prisma.cart_items.updateMany({
              where: {
                drink_id: req.body.drink_id,
              },
              data: {
                quantity: isDrinkExist.quantity + req.body.quantity,
              },
            });
            return res.status(200).json({
              status: 200,
              message: "Berhasil update keranjang",
            });
          }

          ///create cart
          const cartItem = await prisma.cart_items.create({
            data: {
              id: uuid(),
              cart_id: isCartExist.id,
              drink_id: req.body.drink_id,
              quantity: req.body.quantity,
              created_at: new Date(),
              updated_at: new Date(),
              
            },
          });
          if (!cartItem) {
            return res.status(403).json({
              status: 403,
              message: "Gagal masukkan keranjang",
            });
          }
          return res.status(200).json({
            status: 200,
            message: "Berhasil masukkan keranjang",
          });
        }

        ///create new cart
        const cart = await prisma.cart.create({
          data: {
            id: uuid(),
            user_id: req.body.user_id,
            created_at: new Date(),
            updated_at: new Date(),
            
          },
        });

        if (!cart) {
          return res.status(403).json({
            status: 403,
            message: "Gagal menambahkan produk keranjang",
          });
        }
        const cartItem = await prisma.cart_items.create({
          data: {
            id: uuid(),
            cart_id: cart.id,
            drink_id: req.body.drink_id,
            quantity: req.body.quantity,
            created_at: new Date(),
            updated_at: new Date(),
            
          },
        });
        if (!cartItem) {
          return res.status(403).json({
            status: 403,
            message: "Gagal menambahkan produk keranjang",
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Berhasil menambahkan produk keranjang",
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
        // const myCart = await prisma.cart.findFirst({
        //   where: {
        //     user_id: req.body.user_id,
        //   },
        // });
        const cartItem = await prisma.cart_items.findMany({
          // where: {
          //   cart_id: myCart.id,
          // },
        });
        if (!cartItem) {
          return res.status(403).json({
            status: 403,
            message: "Gagal keranjang",
          });
        }
        return res.status(200).json({
          status: 200,
          message: "ok",
          data: cartItem,
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

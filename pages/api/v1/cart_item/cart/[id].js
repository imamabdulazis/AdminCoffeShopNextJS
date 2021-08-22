import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
import prisma from "@utils/prisma";

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });
        const myCart = await prisma.cart.findFirst({
          where: {
            id: id,
          },
        });

        if (myCart) {
          const cartItem = await prisma.cart_items.findMany({
            where: {
              cart_id: myCart?.id,
            },
            select: {
              id: true,
              cart: {
                select: {
                  id: true,
                },
              },
              drink: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              quantity: true,
              updated_at: true,
            },
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
            user: id,
            data: cartItem,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "ok",
          user: id,
          data: [],
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

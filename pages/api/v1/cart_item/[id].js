import authenticateToken from "@helper/autenticate_jwt";
import { PrismaClient } from "@prisma/client";
import prisma from "@utils/prisma";

export default async (req, res) => {
  // const prisma = new PrismaClient();
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "PUT":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        const updateCartItem = await prisma.cart_items.update({
          where: {
            id: id,
          },
          data: {
            quantity: req.body.quantity,
            updated_at: new Date(),
          },
        });

        if (!updateCartItem) {
          return res.status(403).json({
            status: 403,
            message: "Gagal update keranjang",
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Berhasil update keranjang",
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 500,
          message: e,
        });
      }
    case "DELETE":
      try {
        //validate jwt token
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });

        const cartItem = await prisma.cart_items.delete({
          where: {
            id: id,
          },
        });
        if (!cartItem) {
          return res.status(403).json({
            status: 403,
            message: "Gagal hapus keranjang",
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Berhasil hapus keranjang",
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

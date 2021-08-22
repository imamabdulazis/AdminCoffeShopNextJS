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
    case "PUT":
      try {
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });
        const updateOrder = await prisma.orders.update({
          where: {
            id: id,
          },
          data: {
            payment_status: req.body.payment_status,
            status: req.body.status,
          },
        });

        if (!updateOrder)
          return res
            .status(404)
            .json({ status: 404, message: "Update pesanan gagal" });

        return res.status(200).json({
          status: 200,
          message: "Berhasil update pesanan",
          data: updateOrder,
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
        const isAuth = authenticateToken(req, res);
        if (!isAuth)
          return res.status(401).json({
            status: 401,
            message: "Token expired",
          });
        const deleteOrder = await prisma.orders.delete({
          where: {
            id: id,
          },
        });
        if (!deleteOrder)
          return res
            .status(404)
            .json({ status: 404, message: "Hapus pesanan gagal" });

        return res.status(200).json({
          status: 200,
          message: "Berhasil hapus pesanan",
          data: deleteOrder,
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

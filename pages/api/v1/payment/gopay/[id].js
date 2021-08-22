require("dotenv").config();

import { coreApi } from "../../../../../midtrans";
import { PushNotification } from "@utils/notification";
import prisma from "@utils/prisma";
// import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  // const prisma = new PrismaClient();
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      return coreApi.transaction
        .status(id)
        .then(async (responseStatus) => {
          if (responseStatus.transaction_status == "settlement") {
            await prisma.orders.updateMany({
              where: {
                id: id,
              },
              data: {
                payment_status: "Berhasil",
                status: "Selesai",
              },
            });
            await prisma.report.create({
              data: {
                id: uuid(),
                order_id: id,
                date_report: new Date(),
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            const findOrder = await prisma.orders.findFirst({
              where: {
                id: id,
              },
              select: {
                total: true,
              },
            });

            const findDevice = await prisma.device.findFirst({
              where: {
                user_id: req.body.user_id,
              },
            });

            return PushNotification(
              findDevice.fcm_token,
              "Pembayaran Berhasil",
              `#️⃣${findOrder.no_transaction} #️⃣  Rp. ${findOrder.total}`
            )
              .then((responseNotif) => {
                console.log(responseNotif);
                return res.status(200).json(responseStatus);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  status: 500,
                  message: "Internal Server",
                });
              });
          } else {
            return res.status(200).json(responseStatus);
          }
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    default:
      return res
        .status(405)
        .json({ status: 405, message: "Request method tidak di izinkan" });
  }
};

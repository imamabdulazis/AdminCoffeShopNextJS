
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
import { coreApi } from '../../../../../midtrans';
import { PushNotification } from "../../../utils/notification";


export default async (req, res) => {
    const prisma = new PrismaClient();
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case "GET":
            return coreApi.transaction.status(id).then(async (responseStatus) => {
                if (responseStatus.transaction_status == "settlement") {
                    const updateOrders = await prisma.orders.updateMany({
                        where: {
                            id: id,
                        },
                        data: {
                            payment_status: "Berhasil",
                        },
                    });
                    const findOrder = await prisma.orders.findFirst({
                        where: {
                            id: id,
                        },
                        select: {
                            total: true,
                            amount: true,
                            drink: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    })

                    const findDrink = await prisma.drink.findUnique({
                        where: {
                            id: findOrder.drink.id
                        }
                    })
                    const updateDrink = await prisma.drink.updateMany({
                        where: {
                            id: findOrder.drink.id,
                        },
                        data: {
                            stock: findDrink.stock - findOrder.amount,
                        }
                    })
                    const findDevice = await prisma.device.findFirst({
                        where: {
                            user_id: req.body.user_id
                        }
                    });

                    PushNotification(findDevice.fcm_token, "Pembayaran Berhasil", `${findOrder.drink.name} - Total : ${findOrder.total}`).then((responseNotif) => {
                        console.log(responseNotif);
                        return res.status(200).json(responseStatus);
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            status: 500,
                            message: "Internal Server",
                        })
                    });
                } else {
                    return res.status(200).json(responseStatus);
                }
            }).catch((e) => {
                console.log(e)
                return res.status(500).json(e)
            });
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })

    }
}
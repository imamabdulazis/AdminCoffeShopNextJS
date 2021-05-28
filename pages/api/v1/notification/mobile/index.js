import formatRupiah from "../../../utils/formater";
import { PushNotification } from "../../../utils/notification";

export default async (req, res) => {

    const {
        method,
    } = req;

    switch (method) {
        case "POST":
            try {
                PushNotification(req.body.fcm, `Rp. ${formatRupiah(req.body.title)}`, req.body.body).then(res => {
                    return res.status(200).json({
                        status: 200,
                        message: "ok",
                        data: res
                    })
                }).catch(e => {
                    console.log(e)
                    return res.status(500).json({
                        status: 500,
                        message: "Internal Server Error",
                    })
                })
            } catch (e) {
                console.log(e)
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error"
                })
            }
            break;
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }

}
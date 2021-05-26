require('dotenv').config();
let midtransClient = require('midtrans-client');

const clientKey = process.env.CLIENT_KEY_SAND;
const serverKey = process.env.SERVER_KEY_SAND;

export const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: serverKey,
    clientKey: clientKey,
});

export function parameterGopay(
    orderId, total, name, email, telp_number, callback_url
) {
    return {
        "payment_type": "gopay",
        "transaction_details": {
            "order_id": orderId,
            "gross_amount": total
        },
        "gopay": {
            "enable_callback": true,
            "callback_url": callback_url,
        },
        "customer_details": {
            "first_name": name,
            "email": email,
            "phone": telp_number,
        },
        // "custom_expiry": {
        //     "order_time": moment(Date.now()).format('yyyy-MM-dd HH:mm:ss'),
        //     "expiry_duration": 60,
        //     "unit": "second"
        // }
    }
}
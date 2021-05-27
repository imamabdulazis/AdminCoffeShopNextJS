
let midtransClient = require('midtrans-client');
const { coreApi } = require('../../../../../midtrans');

import authenticateToken from '../../../helper/autenticate_jwt'

export default async () => {

    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const isAuth = authenticateToken(req, res)
                if (!isAuth) return res.status(401).json({
                    status: 401,
                    message: "Token expired"
                })

                coreApi.transaction.notification()
                    .then((statusResponse) => {
                        let orderId = statusResponse.order_id;
                        let transactionStatus = statusResponse.transaction_status;
                        let fraudStatus = statusResponse.fraud_status;

                        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

                        // Sample transactionStatus handling logic

                        if (transactionStatus == 'capture') {
                            // capture only applies to card transaction, which you need to check for the fraudStatus
                            if (fraudStatus == 'challenge') {
                                // TODO set transaction status on your databaase to 'challenge'
                            } else if (fraudStatus == 'accept') {
                                // TODO set transaction status on your databaase to 'success'
                            }
                        } else if (transactionStatus == 'settlement') {
                            // TODO set transaction status on your databaase to 'success'
                        } else if (transactionStatus == 'deny') {
                            // TODO you can ignore 'deny', because most of the time it allows payment retries
                            // and later can become success
                        } else if (transactionStatus == 'cancel' ||
                            transactionStatus == 'expire') {
                            // TODO set transaction status on your databaase to 'failure'
                        } else if (transactionStatus == 'pending') {
                            // TODO set transaction status on your databaase to 'pending' / waiting payment
                        }
                    });
            } catch (e) {
                return res.status(500).json({
                    status: 500,
                    message: e
                })
            }
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}
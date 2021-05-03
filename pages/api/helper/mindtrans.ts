require('dotenv').config();

export interface ProcessEnv {
    [key: string]: string | undefined
}

const midtrans = (
    payment_type: string,
    gross_amount: number,
    order_id: string,
    callback_url: string,
) => {
    let midtransURL = process.env["SANDBOK_URL"];


    
}


module.exports = { midtrans }
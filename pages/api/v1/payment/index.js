
export default async (req, res) => {
    switch (req.method) {
        default:
            return res.status(405).json({ status: 405, message: 'Silahkan pilih metode pembayaran.' })
    }
}
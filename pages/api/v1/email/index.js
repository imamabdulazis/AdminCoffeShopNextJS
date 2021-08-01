import { readHTMLFile, smtpTransport } from '@helper/email';

var handlebars = require('handlebars');
var path = require('path');

export default async (req, res) => {

    const { method } = req

    switch (method) {
        case "POST":
            if (req.body.email) {
                const postsDirectory = path.join(process.cwd(), '/src/helper/email.html')
                return readHTMLFile(postsDirectory, function (err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        username: "Default Username"
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        from: 'imamnurohmat21@gmail.com',
                        to: req.body.email,
                        subject: 'Pendaftaran Copsychus Coffe',
                        html: htmlToSend
                    };
                    return smtpTransport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            res.status(500).json(error)
                        } else {
                            res.status(200).json(response)
                        }
                    });
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: "Email belum ada!"
                })
            }
            break;
        default:
            return res.status(405).json({ status: 405, message: 'Request method tidak di izinkan' })
    }
}

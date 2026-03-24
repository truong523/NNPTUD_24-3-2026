const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "YOUR_MAILTRAP_USER",
        pass: "YOUR_MAILTRAP_PASS",
    },
});

module.exports = {
    sendPasswordMail: async function (to, password) {
        await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "Tài khoản của bạn",
            text: `Password của bạn là: ${password}`,
            html: `<h3>Password của bạn là: ${password}</h3>`
        })
    }
}
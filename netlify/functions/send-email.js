const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Separate pageName from the other fields
    const { pageName, ...formFields } = data;

    if (!pageName || Object.keys(formFields).length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Missing required fields: pageName and at least one form field",
        }),
      };
    }

    // Create formatted message with all form fields
    const fieldText = Object.entries(formFields)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "948249001@smtp-brevo.com",
        pass: "ZPm85dfkzLpMaBGx",
      },
    });

    let info = await transporter.sendMail({
      from: "castanedaorlando871@gmail.com",
      to: "patty.powers1200@gmail.com",
      subject: `New submission from ${pageName}`,
      text: `Page: ${pageName}\n\n${fieldText}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent successfully from ${pageName}`,
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

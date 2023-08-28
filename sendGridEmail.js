const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API key
sgMail.setApiKey(process.env.SEND_GRID_KEY);

// Create a nodemailer transporter

// Define email options

// Send the email using @sendgrid/mail
async function sendGridEmail(options) {
  const message = {
    from: process.env.SEND_GRID_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    // Send the email using @sendgrid/mail
    await sgMail.send(message);
    console.log("Email sent using @sendgrid/mail");
  } catch (error) {
    console.error(
      "Error sending email using @sendgrid/mail:",
      error.response.body.errors
    );
  }
}

module.exports = sendGridEmail;

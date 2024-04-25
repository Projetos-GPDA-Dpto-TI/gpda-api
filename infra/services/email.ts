import nodemailer from 'nodemailer';

const transporterConfig = {
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: process.env.NODE_ENV === 'development' ? true : false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

interface emailsender {
  from: { name: string; address: string };
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport(transporterConfig);

async function send({ from, to, subject, text }: emailsender) {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('email sent');
  } catch (err) {
    console.error(err);
  }
}

export default Object.freeze({
  send,
});

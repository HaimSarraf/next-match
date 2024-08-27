import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const link = `http://localhost:3000/verify-email?token=${token}`;

  return resend.emails.send({
    from: "testing@resend.dev",
    to: email,
    subject: "Verify Your Email Address",
    html: `
        <h1>Verify Your Email Address</h1>
        <p>Click The Link Below To Verify Your Email-Address</p>
        <a href="${link}">Verify Email</a>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `http://localhost:3000/reset-password?token=${token}`;

  return resend.emails.send({
    from: "testing@resend.dev",
    to: email,
    subject: "Reset Your Password",
    html: `
        <h1>You've Requested To Reset Your Password</h1>
        <p>Click The Link Below To Reset Your Password</p>
        <a href="${link}">RESET PASSWORD</a>
    `,
  });
}

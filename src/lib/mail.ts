import nodemailer from "nodemailer";
import dns from "dns";

const DEFAULT_SMTP_HOST = "smtp.mail.ru";
const PUBLIC_DNS = ["8.8.8.8", "1.1.1.1"];

try {
  dns.setServers(PUBLIC_DNS);
  console.log("Using custom DNS servers:", dns.getServers());
} catch (dnsErr) {
  console.error("Failed to set custom DNS servers:", dnsErr);
}

export async function resolveHostAddress(host: string): Promise<string> {
  try {
    const addresses = await dns.promises.resolve4(host);
    if (addresses.length > 0) {
      console.log(`Resolved ${host} to ${addresses[0]} using public DNS`);
      return addresses[0];
    }
  } catch (err) {
    console.warn(`Failed to resolve IPv4 for ${host}:`, err);
  }

  try {
    const addresses = await dns.promises.resolve6(host);
    if (addresses.length > 0) {
      console.log(`Resolved ${host} to ${addresses[0]} using public DNS (IPv6)`);
      return addresses[0];
    }
  } catch (err) {
    console.warn(`Failed to resolve IPv6 for ${host}:`, err);
  }

  throw new Error(`Unable to resolve host address for ${host}`);
}

export async function createSmtpTransport() {
  const smtpHost = process.env.SMTP_HOST || DEFAULT_SMTP_HOST;
  const resolvedHost = await resolveHostAddress(smtpHost);
  return nodemailer.createTransport({
    host: resolvedHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    tls: {
      servername: smtpHost,
    },
  });
}

export async function sendMail(options: nodemailer.SendMailOptions) {
  const transporter = await createSmtpTransport();
  return transporter.sendMail(options);
}

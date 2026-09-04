import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    ...(process.env.SMTP_PORT === "587"
      ? {
          secure: false,
          requireTLS: true,
        }
      : {}),
  });
}

export const emailService = {
  isConfigured() {
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  },

  async sendOrderConfirmation(order: any) {
    await this.send({
      to: order.customer?.email || "",
      subject: `Order Confirmation ${order.orderNumber}`,
      html: `<h1>Thank you for your order!</h1><p>Order number: ${order.orderNumber}</p>`,
    });
  },

  async sendPaymentVerified(order: any) {
    await this.send({
      to: order.customer?.email || "",
      subject: `Payment Verified ${order.orderNumber}`,
      html: `<h1>Payment Verified!</h1><p>Your payment for order ${order.orderNumber} has been verified.</p>`,
    });
  },

  async sendShippingNotification(order: any) {
    await this.send({
      to: order.customer?.email || "",
      subject: `Order Shipped ${order.orderNumber}`,
      html: `<h1>Your order has shipped!</h1><p>Tracking number: ${order.trackingNumber}</p>`,
    });
  },

  async send(params: { to: string; subject: string; html: string }) {
    if (!this.isConfigured() || !params.to) {
      console.log("Email not configured or no recipient, skipping:", params.subject);
      return { success: false, error: "Not configured" };
    }

    try {
      const transporter = createTransport();
      const from = process.env.SMTP_FROM || "NOOR <noorwatches.support@gmail.com>";
      await transporter.sendMail({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to send email" };
    }
  },
};
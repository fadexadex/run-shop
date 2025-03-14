import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HOST_EMAIL_ADDRESS,
        pass: process.env.HOST_EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string | string[], subject: string, text?: string, html?: string) {
    const mailOptions = {
      from: `Run-Shop <${process.env.HOST_EMAIL_ADDRESS}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ message: "Mail sent", email: to });
        }
      });
    });
  }

  async sendOrderNotification(sellerEmail: string, order: any) {
    const orderDetails = order.orderItems
      .map(
        (item: any) =>
          `<li>Product ID: <strong>${item.product.id}</strong>, Quantity: <strong>${item.quantity}</strong>, Price: <strong>$${item.price}</strong></li>`
      )
      .join("");

    const emailSubject = `New Order Received - Order ID: ${order.id}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">New Order Notification</h2>
        <p>You have received a new order with the following details:</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Total Price:</strong> $${order.totalPrice}</p>
        <p><strong>Order Items:</strong></p>
        <ul>${orderDetails}</ul>
        <p>
          <a href="${process.env.FRONTEND_URL}/orders/${order.id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            View Order
          </a>
        </p>
        <p>Thank you for using Run-Shop!</p>
      </div>
    `;

    await this.sendMail(sellerEmail, emailSubject, undefined, emailBody);
  }
}

export default EmailService;

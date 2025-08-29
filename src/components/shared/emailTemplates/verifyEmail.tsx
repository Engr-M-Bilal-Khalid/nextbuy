

export const buildEmail = (email: string, code: string) => ({
    from: "Ecommerce Store <onboarding@resend.dev>",
    to: [email],
    subject: "Verify Your Email Address",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Welcome to Cloudmart - A Digital Marketplace!</h2>
      <p style="font-size: 16px; color: #555;">To complete your sign-up, please use the verification code below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #4f46e5; color: white; border-radius: 8px;">${code}</span>
      </div>
      <p style="font-size: 14px; color: #777;">This code will expire in 60 seconds. If you didn’t request this, please ignore this email.</p>
      <p style="font-size: 14px; color: #777;">Thanks,<br/>The Ecommerce Store</p>
    </div>
  `,
});
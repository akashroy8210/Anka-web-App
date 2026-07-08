const nodemailer = require('nodemailer');

const user = process.env.SMTP_USER || 'akashroy73826@gmail.com';
const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
// Strip any spaces from the copy-pasted Google App Password
const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

let transporter = null;
if (pass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
}

exports.sendWeddingOrderEmails = async (orderInfo) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    tierName,
    demoName,
    instanceId,
    pricePaid
  } = orderInfo;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!transporter) {
    throw new Error('Email SMTP Transporter is not configured. Please set SMTP_PASS in your active env.');
  }

  const adminMailOptions = {
    from: `"AnKa Surprise Bot" <${user}>`,
    to: adminEmail,
    subject: `🔔 New Wedding Invitation Order: ${customerName} (${tierName})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ffccd5; border-radius: 12px; padding: 24px; background-color: #fffafb;">
        <h2 style="color: #900c3f; border-bottom: 2px solid #ff85a2; padding-bottom: 8px; font-weight: bold;">New Wedding Invitation Order!</h2>
        <p style="font-size: 14px; color: #4a4a4a;">An order has been successfully placed by a client for a wedding invitation.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018; width: 40%;">Client Name:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #333;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Client Email:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #333;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Phone (WhatsApp):</td>
            <td style="padding: 8px 0; font-size: 14px; color: #333;"><a href="tel:${customerPhone}">${customerPhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Selected Theme:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #333;">${demoName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Package Tier:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #900c3f; font-weight: bold;">${tierName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Price Paid:</td>
            <td style="padding: 8px 0; font-size: 15px; color: #111; font-weight: bold;">₹${pricePaid}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #660018;">Instance ID:</td>
            <td style="padding: 8px 0; font-size: 13px; font-family: monospace; color: #666;">${instanceId}</td>
          </tr>
        </table>
        
        <div style="margin-top: 24px; padding: 12px; background-color: #ffe6eb; border-radius: 8px; font-size: 12px; color: #900c3f;">
          <strong>Action Needed:</strong> Please contact the client on WhatsApp or Email within 24 hours to collect their photos, events schedule, mapping coordinates, and complete the customization setup.
        </div>
      </div>
    `
  };

  const clientMailOptions = {
    from: `"AnKa Surprises" <${user}>`,
    to: customerEmail,
    subject: `💖 Order Successful: Your Wedding Invitation - AnKa`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ffccd5; border-radius: 12px; padding: 24px; background-color: #fffafb;">
        <h2 style="color: #900c3f; text-align: center;">Order Confirmed! 🎉</h2>
        <p style="font-size: 15px; color: #333; line-height: 1.6; text-align: center;">
          Dear <strong>${customerName}</strong>,
        </p>
        <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; text-align: center;">
          Thank you for purchasing the <strong>${tierName} Wedding Invitation Package</strong> (${demoName}) on AnKa! Your payment of <strong>₹${pricePaid}</strong> was successful.
        </p>
        
        <div style="margin: 24px 0; padding: 16px; border: 1px dashed #ff85a2; border-radius: 8px; text-align: center;">
          <h3 style="color: #900c3f; margin-top: 0;">What happens next?</h3>
          <p style="font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 0;">
            Since this is a specialized Wedding Invitation service, our design team will contact you shortly on <strong>${customerPhone}</strong> to collect your images, timeline dates, location links, and custom text preferences. We will handle all setup for you!
          </p>
        </div>

        <p style="font-size: 13px; color: #777; text-align: center; margin-top: 24px;">
          If you have any urgent requests, feel free to contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999; text-align: center;">
          Sent with love by AnKa — Pyaar Ke Pal.
        </p>
      </div>
    `
  };

  try {
    if (adminEmail) {
      await transporter.sendMail(adminMailOptions);
      console.log(`✅ Real Email successfully sent to admin (${adminEmail}).`);
    }
    await transporter.sendMail(clientMailOptions);
    console.log(`✅ Real Email successfully sent to client (${customerEmail}).`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error sending wedding invitation emails:', err);
    throw err;
  }
};

exports.sendSurpriseCredentialsEmail = async (info) => {
  const {
    customerName,
    customerEmail,
    instanceId,
    password,
    categoryName,
    pricePaid
  } = info;

  if (!transporter) {
    throw new Error('Email SMTP Transporter is not configured. Please set SMTP_PASS in your active env.');
  }

  const mailOptions = {
    from: `"AnKa Surprises" <${user}>`,
    to: customerEmail,
    subject: `💖 Order Successful: Your Surprise is Ready! - AnKa`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ffccd5; border-radius: 12px; padding: 24px; background-color: #fffafb;">
        <h2 style="color: #900c3f; text-align: center;">Your Surprise is Ready! 🎉</h2>
        <p style="font-size: 15px; color: #333; line-height: 1.6; text-align: center;">
          Dear <strong>${customerName || 'Customer'}</strong>,
        </p>
        <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; text-align: center;">
          Thank you for purchasing <strong>${categoryName || 'Pyaar Ke Pal Surprise'}</strong> on AnKa! Your payment of <strong>₹${pricePaid}</strong> was successful.
        </p>
        
        <div style="margin: 24px 0; padding: 16px; border: 1px dashed #ff85a2; border-radius: 8px; background-color: #fff; text-align: center;">
          <h3 style="color: #900c3f; margin-top: 0; font-size: 16px;">🔑 Your Access Credentials</h3>
          <p style="font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 12px;">
            Use the credentials below to log in and customize your surprise website (upload photos, change music, customize letters, etc.):
          </p>
          <table style="margin: 0 auto; text-align: left; font-size: 14px;">
            <tr>
              <td style="font-weight: bold; padding: 4px 8px; color: #900c3f;">Login Page:</td>
              <td style="padding: 4px 8px;"><a href="http://localhost:5173/login" style="color: #E11D48; font-weight: bold;">Click Here to Log In</a></td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px; color: #900c3f;">Username/ID:</td>
              <td style="padding: 4px 8px; font-family: monospace; font-weight: bold; background: #eee; border-radius: 4px;">${instanceId}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px; color: #900c3f;">Password:</td>
              <td style="padding: 4px 8px; font-family: monospace; font-weight: bold; background: #eee; border-radius: 4px;">${password}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; text-align: center;">
          Once customized, your private live surprise will be accessible anytime at:<br />
          <a href="http://localhost:5173/s/${instanceId}" style="color: #E11D48; font-weight: bold; text-decoration: underline;">http://localhost:5173/s/${instanceId}</a>
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999; text-align: center;">
          Sent with love by AnKa — Pyaar Ke Pal.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Real Credentials Email successfully sent to client (${customerEmail}).`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error sending credentials email:', err);
    throw err;
  }
};

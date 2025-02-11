import nodemailer from "nodemailer";
// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    // user: "japinanclarence@gmail.com",
    // pass:"uzfufenwxeiufdli",
  },
});

export const sendMail = async (to, subject, msg) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailTemplate(msg),
  });
};

const emailTemplate = (message) => {
  return `
    <body style="font-family: 'Poppins', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                        AceTrack
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="body" style="padding: 40px; text-align: left; font-size:16px; font-weight:bold; line-height: 1.6;">
                        Hello, ${message.firstname}! <br>
                        <p style="font-size: 12px; font-weight:normal;"> Your One-Time Password (OTP) is below. It expires in 5 minutes.  </p>        
                        </td>
                    </tr>

                    <!-- Call to action Button -->
                    <tr>
                        <td style="padding: 40px; text-align: center; background-color:#F5F5F5">
                            <!-- CTA Button -->
                            <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                <tr>
                                    <td align="center" style="font-size:20px; padding-block:20px; font-weight:bold;">
                                        <div href="" style="color:#1E1E1E; padding-block:20px; text-decoration: none; font-weight: bold;">${message.otp}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="body" style="padding: 40px; text-align: left; font-size: 12px; line-height: 1.6;">
                            Never share this code with anyone.
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                        Copyright &copy; 2024 | AceTrack
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
  `;
};

import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (message) => {
  return `
   <body style="font-family: 'Poppins', Arial, sans-serif">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px">
        <table
          class="content"
          width="600"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="border-collapse: collapse; border: 1px solid #cccccc"
        >
          <tr>
            <td
              class="header"
              style="
                padding: 40px;
                text-align: center;
                color: #ff8c42;
                font-size: 24px;
                font-weight: bold;
                border-bottom: 2px solid #ff8c42;
              "
            >
              ACETRACK
            </td>
          </tr>
           <tbody style="background: url(cid:stallion) no-repeat center;">
            <tr>
              <td
                class="body"
                style="
                  padding: 40px;
                  text-align: left;
                  font-size: 16px;
                  font-weight: bold;
                  line-height: 1.6;
                "
              >
                Hello, ${message.firstname}! <br />
                <p style="font-size: 12px; font-weight: normal">
                  Your One-Time Password (OTP) is below. It expires in 5
                  minutes.
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 200px; text-align: center; position: relative">
                <div
                  style="
                    color: #2c2d2d;
                    text-decoration: none;
                    letter-spacing: 20px;
                    font-size: 40px;
                    font-weight: bold;
                    position: relative;
                    z-index: 1;
                    display: inline-block;
                    /* background: rgba(255, 255, 255, 0.8); */
                    padding: 10px 20px;
                    border-radius: 5px;
                  "
                >
                  ${message.otp}
                </div>
              </td>
            </tr>
            <tr>
              <td
                class="body"
                style="padding: 40px; text-align: left; font-size: 12px"
              >
                Never share this code with anyone.
              </td>
            </tr>
          </tbody>
          <tr>
            <td
              class="footer"
              style="background-color: #ff8c42; padding: 40px; font-size: 12px"
            >
              <table
                role="presentation"
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tr>
                  <td align="right">
                    <table
                      role="presentation"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tr>
                        <td
                          style="
                            color: white;
                            text-align: right;
                            padding-right: 10px;
                          "
                        >
                          <h1
                            style="
                              margin: 0;
                              font-weight: normal;
                              font-size: 18px;
                            "
                          >
                            ACES
                          </h1>
                          <p style="margin: 0; font-size: 12px">
                            Davao Oriental State University
                          </p>
                        </td>
                        <td>
                          <img
                            src="cid:acesLogo"
                            alt="ACES Logo"
                            style="height: 50px; vertical-align: middle"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>


  `;
};

// Attach images when sending the email
export const sendMail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailTemplate(message),
    attachments: [
      {
        filename: "ACES_LOGO.png",
        path: path.join(__dirname, "../assets/ACES_LOGO.png"),
        cid: "acesLogo",
      },
      {
        filename: "stallion.png",
        path: path.join(__dirname, "../assets/stallion.png"),
        cid: "stallion",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

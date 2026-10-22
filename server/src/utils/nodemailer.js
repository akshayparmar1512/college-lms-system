import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendAdminCredentialsMail = async (adminName, collegeName, adminEmail, temporaryPassword,to) => {

    const mailOptions = {
        from: `ADP LMS System <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `Admin Credentials - ADP LMS System`,
        html: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Welcome to ADP LMS</title>
</head>
<body style="margin:0; padding:0; background-color:#eef2f4; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
 
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#eef2f4;">
    Your college ${collegeName} has been successfully registered, and your administrator account has been created.
  </div>
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef2f4;">
    <tr>
      <td align="center" style="padding:40px 12px;">
 
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; border:1px solid #dde4e8; border-radius:12px; border-collapse:separate; overflow:hidden;">
 
          <!-- Header -->
          <tr>
            <td style="background-color:#134e4a; padding:30px 44px;">
                            <div style="font-size:24px; font-weight:700; color:#ffffff; line-height:1.3; letter-spacing:0.5px;">ADP LMS System</div>
            </td>
          </tr>
 
          <!-- Accent line -->
          <tr>
            <td style="height:3px; background-color:#0d9488; font-size:0; line-height:0;">&nbsp;</td>
          </tr>
 
          <!-- Greeting -->
          <tr>
            <td style="padding:40px 44px 0 44px;">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#1e293b; line-height:1.3;">Hi ${adminName},</h1>
              <p style="margin:14px 0 0 0; font-size:17px; font-weight:600; color:#0f766e; line-height:1.5;">
                Welcome to ADP LMS!
              </p>
              <p style="margin:16px 0 0 0; font-size:15px; line-height:1.8; color:#475569;">
                Your college ${collegeName} has been successfully registered, and your administrator account has been created.
              </p>
            </td>
          </tr>
 
          <!-- Login details -->
          <tr>
            <td style="padding:30px 44px 0 44px;">
              <div style="font-size:15px; font-weight:700; color:#1e293b; padding-bottom:12px; border-bottom:2px solid #134e4a;">
                Your Login Details
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="36%" style="padding:16px 16px 16px 0; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; vertical-align:top;">College</td>
                  <td style="padding:16px 0; font-size:14px; font-weight:600; color:#1e293b; border-bottom:1px solid #e2e8f0; vertical-align:top;">${collegeName}</td>
                </tr>
                <tr>
                  <td width="36%" style="padding:16px 16px 16px 0; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; vertical-align:top;">Email</td>
                  <td style="padding:16px 0; font-size:14px; font-weight:600; border-bottom:1px solid #e2e8f0; vertical-align:top;">
                    <a href="mailto:${adminEmail}" style="color:#0f766e; text-decoration:none;">${adminEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td width="36%" style="padding:16px 16px 16px 0; font-size:13px; color:#64748b; vertical-align:middle;">Temporary Password</td>
                  <td style="padding:12px 0; vertical-align:middle;">
                    <span style="display:inline-block; font-family:'SFMono-Regular', Consolas, 'Courier New', monospace; font-size:14px; font-weight:700; color:#134e4a; background-color:#f0fdfa; border:1px solid #99d5cf; padding:7px 14px; border-radius:6px; letter-spacing:0.6px; word-break:break-all;">${temporaryPassword}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Security notice -->
          <tr>
            <td style="padding:30px 44px 0 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb; border:1px solid #fde68a; border-left:4px solid #d97706; border-radius:6px; border-collapse:separate;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:13px; font-weight:700; color:#92400e; margin-bottom:6px;">Important Security Notice</div>
                    <div style="font-size:13px; line-height:1.65; color:#78350f;">
                      Please change your temporary password immediately after your first login.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Support & signature -->
          <tr>
            <td style="padding:34px 44px 44px 44px;">
              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.75; color:#475569;">
                If you have any trouble accessing your account, please contact the ADP LMS support team.
              </p>
              <p style="margin:0; font-size:14px; line-height:1.6; color:#475569;">Best regards,</p>
              <p style="margin:4px 0 0 0; font-size:15px; font-weight:700; color:#1e293b;">The ADP LMS Team</p>
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td style="background-color:#f6f9fa; border-top:1px solid #dde4e8; padding:20px 44px; text-align:center;">
              <div style="font-size:12px; color:#94a3b8; line-height:1.7;">
                This is an automated, system-generated email. Please do not reply to this message.
              </div>
            </td>
          </tr>
 
 
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>

        `
    }
    return await transporter.sendMail(mailOptions)
}

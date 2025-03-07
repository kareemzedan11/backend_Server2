const nodemailer = require("nodemailer");
const { emailService } = require("../config/appConfig");

// ✅ Configure Gmail SMTP settings
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: emailService.user, // ✅ Your Gmail address
		pass: emailService.pass, // ✅ Your App Password
	},
});

// ✅ Send Email Notifications
const sendNotification = async (role, recipientEmails, message) => {
	try {
		console.log(`📢 Sending email to:`, recipientEmails);

		const mailOptions = {
			from: emailService.user,
			to: recipientEmails,
			subject: "📢 Notification from Capital Taxi",
			text: message,
		};

		// ✅ Send the email
		await transporter.sendMail(mailOptions);

		console.log("✅ Email sent successfully!");

		return { success: true, message: "Notifications sent via Gmail." };
	} catch (err) {
		console.error("❌ Error in sendNotification:", err.message);
		throw new Error("Gmail notification service failed.");
	}
};

module.exports = { sendNotification };

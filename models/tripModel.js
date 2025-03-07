const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}, // User who booked the trip
		driver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Driver",
			default: null,
		}, // Assigned driver
		origin: { type: String, required: true },
		destination: { type: String, required: true },
		distanceInKm: { type: Number, required: true },
		fare: { type: Number, required: true },
		paymentMethod: { type: String, required: true }, // e.g., "cash" or "credit card"
		status: {
			type: String,
			enum: ["pending", "accepted", "completed", "canceled"],
			default: "pending",
		},
		rating: { type: Number, min: 1, max: 5 }, // User's rating for the driver
		complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }, // Reference to complaint if filed
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);

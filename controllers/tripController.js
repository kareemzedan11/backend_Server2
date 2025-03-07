const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const Driver = require("../models/driverModel");
const mongoose = require("mongoose");
const { getDirections } = require("../services/googleMapsService");
const {
	fuelCostPerLiter,
	carFuelEfficiency,
	baseFare,
} = require("../config/appConfig");

exports.calculateFare = async (req, res) => {
	try {
		const { origin, destination, paymentMethod } = req.query;

		if (!origin || !destination || !paymentMethod) {
			return res.status(400).json({
				error: "Origin, destination, and payment method are required!",
			});
		}
		
		// ✅ Get route details from GraphHopper
		const route = await getDirections(origin, destination);

		if (!route || !route.distance) {
			return res
				.status(400)
				.json({ error: "Failed to get route details." });
		}

		// ✅ Calculate fare
		const costPerKm = fuelCostPerLiter / carFuelEfficiency;
		const estimatedFare = (baseFare + route.distance * costPerKm).toFixed(
			2
		);

		// ✅ Send response
		res.status(200).json({
			fare: estimatedFare,
			paymentMethod,
			route,
		});
	} catch (err) {
		console.error("🚨 Error in calculateFare:", err.message);
		res.status(500).json({
			error: "Failed to calculate fare. Please try again later.",
		});
	}
};

exports.getTripDirections = async (req, res) => {
	try {
		const { origin, destination } = req.query;

		// ❌ Check if required parameters are missing
		if (!origin || !destination) {
			return res
				.status(400)
				.json({ error: "❌ Origin and destination are required." });
		}

		// ✅ Fetch directions from GraphHopper Service
		const directions = await getDirections(origin, destination);

		res.status(200).json(directions);
	} catch (err) {
		console.error("🚨 Error in getTripDirections:", err.message);
		res.status(500).json({ error: "❌ Failed to fetch trip directions." });
	}
};

exports.createTrip = async (req, res) => {
	const { id, origin, destination, paymentMethod, fare, distanceInKm } =
		req.body;

	if (!origin || !destination || !paymentMethod || !fare) {
		return res
			.status(400)
			.json({ error: "All trip details are required." });
	}
	const userObjectId = new mongoose.Types.ObjectId(id);
	try {
		const newTrip = new Trip({
			user: userObjectId,
			origin,
			destination,
			paymentMethod,
			fare,
			distanceInKm,
			status: "pending",
		});

		await newTrip.save();
		res.status(201).json({
			message: "Trip request created successfully!",
			trip: newTrip,
		});
	} catch (err) {
		console.error("Error in createTrip:", err.message);
		res.status(500).json({ error: "Failed to create trip request." });
	}
};

// Assign a driver to a trip
exports.assignDriver = async (req, res) => {
	const { tripId, driverId } = req.body;

	try {
		const trip = await Trip.findById(tripId);
		if (!trip || trip.status !== "pending") {
			return res
				.status(400)
				.json({ error: "Trip not available for assignment." });
		}

		const driver = await Driver.findById(driverId);
		if (!driver) {
			return res.status(404).json({ error: "Driver not found." });
		}

		trip.driver = driverId;
		trip.status = "accepted";
		await trip.save();

		res.status(200).json({
			message: "Driver assigned successfully!",
			trip,
		});
	} catch (err) {
		console.error("Error in assignDriver:", err.message);
		res.status(500).json({ error: "Failed to assign driver." });
	}
};

// Update trip status (e.g., completed, canceled)
exports.updateTripStatus = async (req, res) => {
	const { tripId, status } = req.body;

	if (!["accepted", "completed", "canceled"].includes(status)) {
		return res.status(400).json({ error: "Invalid status update." });
	}

	try {
		const trip = await Trip.findById(tripId);
		if (!trip) {
			return res.status(404).json({ error: "Trip not found." });
		}

		trip.status = status;
		await trip.save();

		res.status(200).json({
			message: "Trip status updated successfully!",
			trip,
		});
	} catch (err) {
		console.error("Error in updateTripStatus:", err.message);
		res.status(500).json({ error: "Failed to update trip status." });
	}
};

// Fetch trips for a user
exports.getUserTrips = async (req, res) => {
	try {
		const trips = await Trip.find({ user: req.user.id }).populate(
			"driver",
			"name phone"
		);
		res.status(200).json(trips);
	} catch (err) {
		console.error("Error in getUserTrips:", err.message);
		res.status(500).json({ error: "Failed to fetch user trips." });
	}
};

// Fetch trips for a driver
exports.getDriverTrips = async (req, res) => {
	try {
		const trips = await Trip.find({ driver: req.user.id }).populate(
			"user",
			"name phone"
		);
		res.status(200).json(trips);
	} catch (err) {
		console.error("Error in getDriverTrips:", err.message);
		res.status(500).json({ error: "Failed to fetch driver trips." });
	}
};

exports.deleteTrip = async (req, res) => {
	try {
		const { id } = req.params;
		const trip = await Trip.findByIdAndDelete(id);

		if (!trip) {
			return res.status(404).json({ error: "❌ Trip not found." });
		}

		res.status(200).json({ message: "✅ Trip deleted successfully!" });
	} catch (err) {
		console.error("🚨 Error deleting trip:", err.message);
		res.status(500).json({ error: "❌ Failed to delete trip." });
	}
};

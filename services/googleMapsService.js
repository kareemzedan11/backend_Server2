const { graphHopper } = require("../config/apiConfig");

exports.getDirections = async (origin, destination) => {
	try {
		// ✅ Dynamic Import for node-fetch
		const fetch = (await import("node-fetch")).default;

		// ✅ Construct GraphHopper API request
		const url = `${graphHopper.baseUrl}/route?point=${origin}&point=${destination}&vehicle=car&locale=en&calc_points=true&key=${graphHopper.apiKey}`;
		console.log("🚀 GraphHopper API Request:", url);

		// ✅ Fetch response
		const response = await fetch(url);
		const textData = await response.text(); // Read raw response before parsing
		console.log("📡 GraphHopper Raw Response:", textData); // Debugging raw response

		// ✅ Convert to JSON (if valid)
		const data = JSON.parse(textData); // Manually parse JSON

		// ❌ Handle case where no route is found
		if (!data.paths || data.paths.length === 0) {
			throw new Error("❌ No route found using GraphHopper.");
		}

		// ✅ Return extracted route details
		return {
			distance: data.paths[0].distance / 1000, // Convert meters to KM
			duration: data.paths[0].time / 1000 / 60, // Convert ms to minutes
			points: data.paths[0].points, // Encoded route points
		};
	} catch (err) {
		console.error("🚨 GraphHopper Error:", err.message);
		throw new Error("❌ Failed to fetch route. Please try again later.");
	}
};

const { createTrip } = require("../../controllers/tripController");

test("Create trip request should return trip details", async () => {
	const req = {
		user: { id: "67a608f72dec5b6934bb7d36" },
		driver: { id: "67a606aed164a95a9701ee19" },
		body: {
			origin: "Cairo, Egypt",
			destination: "Giza, Egypt",
			paymentMethod: "cash",
			distanceInKm: "10",
			fare: 50,
		},
	};
	const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

	await createTrip(req, res);
	expect(res.status).toHaveBeenCalledWith(201);
});

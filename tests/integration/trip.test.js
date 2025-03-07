// const request = require("supertest");
// const app = require("../../app");

// jest.mock("../../services/googleMapsService", () => ({
// 	getDirections: jest.fn(() =>
// 		Promise.resolve({
// 			distance: 10, // Mocked 10 km distance
// 			duration: 15, // Mocked 15 min duration
// 			points: "mocked_polyline_data",
// 		})
// 	),
// }));

// describe("Trip API Tests", () => {
// 	let token;

// 	beforeAll(async () => {
// 		const loginRes = await request(app).post("/api/auth/login").send({
// 			email: "testuser@example.com",
// 			password: "password123",
// 			role: "User",
// 		});
// 		token = loginRes.body.token;
// 		userId = loginRes.body.account._id;
// 	});

// 	test("Calculate fare", async () => {
// 		const res = await request(app)
// 			.post("/api/trips/calculate-fare")
// 			.set("Authorization", `Bearer ${token}`)
// 			.send({
// 				origin: "Cairo, Egypt",
// 				destination: "Giza, Egypt",
// 				paymentMethod: "cash",
// 			});

// 		expect(res.statusCode).toBe(200);
// 	});

// 	test("Create a trip", async () => {
// 		const res = await request(app)
// 			.post("/api/trips/create")
// 			.set("Authorization", `Bearer ${token}`)
// 			.send({
// 				id: userId,
// 				origin: "Cairo, Egypt",
// 				destination: "Giza, Egypt",
// 				paymentMethod: "cash",
// 				fare: 50,
// 				distanceInKm: "10",
// 			});

// 		expect(res.statusCode).toBe(201);
// 	});
// });

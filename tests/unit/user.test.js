const {
	getProfile,
	updateProfile,
} = require("../../controllers/userController");

const mongoose = require("mongoose");

test("Get user profile should return user data", async () => {
	const req = { user: { id: "67a608f72dec5b6934bb7d36" } };
	const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

	await getProfile(req, res);
	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toBeDefined();
});

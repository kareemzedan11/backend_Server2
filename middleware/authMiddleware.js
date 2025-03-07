const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/appConfig");

exports.protect = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid token." });
	}
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: "Access forbidden." });
		}
		next();
	};
};

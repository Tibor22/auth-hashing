const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

const privateKey = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
	const { username, password } = req.body;

	const foundUser = await prisma.user.findFirst({
		where: {
			username,
		},
	});
	if (!foundUser) {
		return res.status(401).json({ error: "Invalid username." });
	}
	const comparedPassword = await bcrypt.compare(password, foundUser.password);
	if (!foundUser || !comparedPassword) {
		return res.status(401).json({ error: "Invalid username or password." });
	}

	console.log(foundUser);
	const token = jwt.sign({ username }, privateKey);

	res.json({ data: { token,username: foundUser.username}});
});

module.exports = router;

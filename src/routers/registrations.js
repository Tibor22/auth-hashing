const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
	console.log(req.body);
	const { username, password } = req.body;

	try {
		const passwordHash = await bcrypt.hash(password, 10);
		const createdUser = await prisma.user.create({
			data: {
				username,
				password: passwordHash,
			},
		});
        if(!createdUser) {
            throw new Error(`User ${username} already exist`)
        }

		return res.json({ data: createdUser });
	} catch (e) {
        if(e.code === "P2002") {
            return res.status(400).json({error: 'Username already exist'})
        }
        console.log('WAGWAN');
		
	}

});

module.exports = router;

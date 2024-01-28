import validator from "validator";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import xss from "xss";

const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		const sanitizedEmail = xss(email);

		if (!validator.isEmail(sanitizedEmail)) {
			return res.status(400).json({ error: "Invalid email" });
		}

		const user = await UserModel.findOne({ email: sanitizedEmail });
		if (!user) {
			return res.status(401).json({ error: "User not registered" }); //Unauthorized
		}

		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("token", token, {
			httpOnly: true,
			maxAge: 3600000,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
		});

		res.status(200).json({ success: true, message: "Login successful" });
	} catch (error) {
		console.error("Error in login", error);

		res.status(500).json({ success: false, error: "Internal server error" });
	}
};

export default loginController;

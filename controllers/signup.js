import validator from "validator";
import xss from 'xss';
import UserModel from "../models/userModel.js";

const signupController = async (req, res) => {
	try {
		const { name, email, phoneNumber, password } = req.body;
		const sanitizedName = xss(name);
		const sanitizedEmail = xss(email);
		const sanitizedPhoneNumber = xss(phoneNumber);

		if (!validator.isEmail(sanitizedEmail)) {
			return res.status(400).send({ error: "Invalid email" });
		}

		if (
			!validator.isMobilePhone(sanitizedPhoneNumber, "any", {
				strictMode: false,
			})
		) {
			return res.status(400).send({ error: "Invalid phone number" });
		}

		const newUser = new UserModel({
			name: sanitizedName,
			email: sanitizedEmail,
			password: password,
			phoneNumber: sanitizedPhoneNumber,
            isAdmin: false
		});

		await newUser.save();

		res.status(201).json({ success: true, message: "User registered successfully" });
	} catch (error) {
		console.log("Error in registering user", error);

		if (error.code === 11000) {
			return res
				.status(400)
				.json({
					success: false,
					error: "Email or phone number already in use",
				});
		}

		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};

export default signupController;

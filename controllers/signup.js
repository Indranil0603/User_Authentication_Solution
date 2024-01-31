const validator = require("validator");
const xss = require("xss");
const UserModel = require("../models/userModel.js");
const parsePhoneNumber = require("awesome-phonenumber");

const signupController = async (req, res) => {
	try {
		const { name, email, phoneNumber, password } = req.body;
		const sanitizedName = xss(name); //Check for xss on inputs
		const sanitizedEmail = xss(email);
		const sanitizedPhoneNumber = xss(phoneNumber);

        //Check for valid email format
		if (!validator.isEmail(sanitizedEmail)) {
			return res.status(400).send({ error: "Invalid email" });
		}
        const parsedPhoneNumber = parsePhoneNumber(sanitizedPhoneNumber,{ regionCode: 'IN' });
        
        //check for valid phone number
		if (
			!parsedPhoneNumber.g.valid
		) {
			return res.status(400).send({ error: "Invalid phone number" });
		}

        //check for strong password
		const isStrongPassword = validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		});

		if (!isStrongPassword) {
			return res
				.status(400)
				.send({
					error:
						"Weak password. Must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
				});
		}

        //If all checks passed user is registered
		const newUser = new UserModel({
			name: sanitizedName,
			email: sanitizedEmail,
			password: password,
			phoneNumber: parsedPhoneNumber.g.number.e164,
			isAdmin: false,
		});

		await newUser.save();

		res
			.status(201)
			.json({ success: true, message: "User registered successfully" });
	} catch (error) {
		console.log("Error in registering user", error);

        //If email or password same mongoDB will throw the error 11000 
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				error: "Email or phone number already in use",
			});
		}

		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};

module.exports = signupController;

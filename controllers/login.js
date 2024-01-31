const validator = require("validator");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel.js");
const xss = require("xss");

const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		const sanitizedEmail = xss(email); //filter for xss
		if (!validator.isEmail(sanitizedEmail)) { //validating email format
			return res.status(400).json({ error: "Invalid email" });
		}

		const user = await UserModel.findOne({ email: sanitizedEmail });
		if (!user) {
			return res.status(401).json({ error: "User not registered" }); //Unregistered User
		}
		const now = new Date();
		if ( //Condition for locking the account if more than 5 login attempts are made a wait time of 1min is imposed
			user.lastLoginAttempt &&
			user.loginAttempts >= 5 &&
			now - user.lastLoginAttempt < 60 * 1000
		) {
			const waitTime = Math.ceil(
				(60 * 1000 - (now - user.lastLoginAttempt)) / 1000
			);
			return res.status(401).json({
				error: `Too many login attempts. Please wait ${waitTime} seconds and try again.`,
			});
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
            //In case of wrong password login attempts are added along with the time of attempt
			user.loginAttempts += 1;
			user.lastLoginAttempt = now; 
			await user.save();

			if (user.loginAttempts >= 5) {
				return res.status(401).json({
					error:
						"Too many failed login attempts. Your account is temporarily locked.",
				});
			}

			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Reset login attempts upon successful login
		user.loginAttempts = 0;
		user.lastLoginAttempt = null;
		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

        //JWT token sent in cookie in case of successfull login
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

module.exports = loginController;

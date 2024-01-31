const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	phoneNumber: {
		type: String,
		required: true,
		unique: true,
	},
	isAdmin: {
		type: Boolean,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	loginAttempts: {
		type: Number,
		default: 0,
	},
	lastLoginAttempt: {
		type: Date,
		default: null,
	},
});

// Create an index on the email field
userSchema.index({ email: 1 }, { unique: true });

// Hash the password using bcrypt on saving the user
userSchema.pre("save", async function (next) {
	try {
		if (this.isModified("password") || this.isNew) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
		next();
	} catch (error) {
		next(error);
	}
});

// Function to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw error;
	}
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

export const UsersCollection = model("users", userSchema);
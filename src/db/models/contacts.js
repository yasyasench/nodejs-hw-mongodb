import { Schema, model } from "mongoose";

const contactsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
		isFavourite: {
			type: Boolean,
			default: false,
		},
		contactType: {
			type: String,
			enum: ["personal", "work", "home"],
			required: true,
			default: "personal",
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

export const ContactsCollection = model("contacts", contactsSchema);
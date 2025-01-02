import createHttpError from "http-errors";
import { UsersCollection } from "./../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { SessionsCollection } from "./../db/models/session.js";
import { FIFTEEN_MINUTES, SMTP, THIRTY_DAYS } from "./../constants/index.js";
import { env } from '../utils/env.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

export const registerUser = async (payload) => {
	const user = await UsersCollection.findOne({ email: payload.email });

	if (user) {
		throw createHttpError(409, "Email in use");
	}

	const encryptedPassword = await bcrypt.hash(payload.password, 10);

	return await UsersCollection.create({
		...payload,
		password: encryptedPassword,
	});
};

export const loginUser = async (payload) => {
	const user = await UsersCollection.findOne({ email: payload.email });

	if (!user) {
		throw createHttpError(401, "User not found");
	}

	const isEqual = await bcrypt.compare(payload.password, user.password);

	if (!isEqual) {
		throw createHttpError(401, "Password is invalid");
	}

	await SessionsCollection.deleteOne({ userId: user._id });

	const accessToken = randomBytes(30).toString("base64");
	const refreshToken = randomBytes(30).toString("base64");

	return await SessionsCollection.create({
		userId: user._id,
		accessToken,
		refreshToken,
		accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
		refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
	});
};


export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
	const session = await SessionsCollection.findOne({
		_id: sessionId,
		refreshToken,
	}); 

	if (!session) {
		throw createHttpError(401, "Session not found");
	}

	const isExpired = new Date() > new Date(session.refreshTokenValidUntil);

	if (isExpired) {
		throw createHttpError(401, "Session is expired");
	}

	const newAccessToken = randomBytes(30).toString("base64");
	const newRefreshToken = randomBytes(30).toString("base64");

	const newSession = {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
		accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
		refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
	};

	await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

	return await SessionsCollection.create({
		userId: session.userId,
		...newSession,
	});
};

export const logoutUser = async (sessionId) =>
	await SessionsCollection.deleteOne({ _id: sessionId });


//reset pasword
export const requestResetToken = async (email) => {
	const user = await UsersCollection.findOne({ email });

	if (!user) {
		throw createHttpError(404, "User not found!");
	}

	const resetToken = jwt.sign({ sub: user._id, email }, env("JWT_SECRET"), {
		expiresIn: "5m",
	});

	const sendResetEmailTempatePath = path.join(
		TEMPLATES_DIR,
		"reset-password-email.html",
	);

	const templateSource = await fs.readFile(sendResetEmailTempatePath, "utf-8");

	const template = handlebars.compile(templateSource);

	const html = template({
		name: user.name,
		link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
	});

	const result = await sendEmail({
		from: env(SMTP.SMTP_FROM),
		to: email,
		subject: "Reset password",
		html,
	});

	if (!result) {
		throw createHttpError(
			500,
			"Failed to send the email, please try again later.",
		);
	}
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
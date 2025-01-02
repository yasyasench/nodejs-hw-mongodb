import dotenv from "dotenv";

dotenv.config();

export const env = (key, defaultValue) => process.env[key] || defaultValue;
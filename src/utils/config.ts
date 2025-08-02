import env from "dotenv";
env.config();

export const AJUTOR_API_KEY = process.env.AJUTOR_API_KEY;
export const PORT = process.env.PORT || 8000;

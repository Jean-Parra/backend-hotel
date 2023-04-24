import { config } from "dotenv";

config();

export default {
    secret: process.env.secret || ""
};
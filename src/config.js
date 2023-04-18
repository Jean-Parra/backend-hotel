import { config } from "dotenv";

config();

export default {
    secret: process.env.secret || "",
    host: process.env.host || "",
    port: process.env.port || "",
    user: process.env.user || "",
    password: process.env.password || "",
    database: process.env.database || "",

};
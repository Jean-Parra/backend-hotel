import express from "express";
import morgan from "morgan";
// Routes
import userRoutes from "./routes/user.routes";
const cors = require('cors');

const app = express();

app.set("port", 3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api/usuarios", userRoutes);

export default app;
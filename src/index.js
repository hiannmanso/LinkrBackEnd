import express from "express";
import dotenv from "dotenv";
import router from "./routers/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port " + process.env.PORT);
}));
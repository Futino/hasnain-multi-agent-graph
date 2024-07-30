import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import graphRoute from "./routes/graph.route";
import dotenv from "dotenv";

dotenv.config();

// App
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("trust proxy", 1);
app.use(morgan("common"));

app.use(bodyParser.json({ limit: "500mb" }));

app.use(
  cors({
    origin: "http://localhost:3000", // Allows access from this origin
    credentials: true,
  })
);

app.use("/api/graph", graphRoute);

app.use("/", (req: Request, res: Response) => {
  res.send("Server running");
});

// Port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is Running");
});

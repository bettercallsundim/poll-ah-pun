import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import requestIp from "request-ip";
// import redis from "./config/redis";
import pollRoutes from "./routes/poll.routes";
import OhError, { errorHandler } from "./utils/errorHandler";

const app = express();

dotenv.config();
// redis
//   .connect()
//   .then(() => {
//     console.log("Redis connected");
//   })
//   .catch((err) => {
//     console.log("Redis connection failed", err);
//   });

//middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND as string],
    credentials: true,
  })
);
app.use(requestIp.mw());

app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use("/uploads", express.static("uploads"));
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/poll", pollRoutes);

app.use("*", (req, res, next) => {
  throw new OhError(400, "Route does not exists");
});

app.use(errorHandler);

//start server
app.listen(4000, () => {
  console.log("Server started");
});

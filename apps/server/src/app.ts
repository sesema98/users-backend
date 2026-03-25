import fs from "node:fs";
import path from "node:path";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env, isProduction } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { userRouter } from "./routes/user.routes";

const app = express();

const allowedOrigins = new Set(
  [env.CLIENT_URL, "http://localhost:5173"].filter(
    (value): value is string => Boolean(value)
  )
);

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS"));
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? "combined" : "dev"));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/users", userRouter);

const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!api).*/, (_request, response) => {
    response.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (_request, response) => {
    response.json({
      message: "Users CRUD API",
      frontend: "Ejecuta el cliente de React en desarrollo o compila la app."
    });
  });
}

app.use(notFound);
app.use(errorHandler);

export { app };

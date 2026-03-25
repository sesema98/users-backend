import "dotenv/config";

import { prisma } from "./lib/prisma";
import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`API disponible en http://0.0.0.0:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Recibido ${signal}. Cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

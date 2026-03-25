import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedUsers = [
  {
    firstName: "Lucia",
    lastName: "Vega",
    email: "lucia.vega@example.com",
    phone: "+51 999 111 222",
    role: "admin",
    status: "active",
    notes: "Gestiona accesos y revisa reportes semanales."
  },
  {
    firstName: "Mateo",
    lastName: "Ramos",
    email: "mateo.ramos@example.com",
    phone: "+51 999 333 444",
    role: "editor",
    status: "active",
    notes: "Responsable de actualizar perfiles del equipo comercial."
  },
  {
    firstName: "Camila",
    lastName: "Paredes",
    email: "camila.paredes@example.com",
    phone: "+51 999 555 666",
    role: "viewer",
    status: "pending",
    notes: "Pendiente de activacion por parte de administracion."
  },
  {
    firstName: "Diego",
    lastName: "Salas",
    email: "diego.salas@example.com",
    phone: "+51 999 777 888",
    role: "editor",
    status: "inactive",
    notes: "Usuario pausado mientras se actualiza su area."
  }
];

async function main() {
  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

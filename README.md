# Users CRUD con Node, React y Prisma

Aplicacion full stack para administrar la tabla `users` con:

- Backend en Node.js + Express + Prisma
- Frontend en React + Vite
- PostgreSQL como base de datos
- Estructura lista para desplegar en Render

## Lo que incluye

- CRUD completo de usuarios
- Busqueda por nombre, apellido, correo y telefono
- Filtros por rol y estado
- Ordenamiento y paginacion
- Validacion de payloads con Zod
- Manejo de errores de API y errores de Prisma
- Seeds iniciales para poblar `users`
- Build unificado para servir frontend y backend desde un solo servicio

## Estructura

```text
.
├── apps
│   ├── client   # React + Vite
│   └── server   # Express API
├── prisma       # schema, migraciones y seed
├── render.yaml  # blueprint para Render
└── prisma.config.ts
```

## Requisitos

- Node.js `22.22.0` o compatible con `>=20 <23`
- npm `>=10 <11`
- PostgreSQL

## Variables de entorno

Usa el archivo `.env.example` como referencia:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/users_crud?schema=public"
PORT=4000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env`.

3. Ejecuta migraciones:

```bash
npm run prisma:migrate:deploy
```

4. Carga datos de ejemplo:

```bash
npm run prisma:seed
```

5. Levanta frontend y backend:

```bash
npm run dev
```

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:migrate:deploy
npm run prisma:seed
```

## API principal

- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Deploy en Render

Este repo incluye un `render.yaml` para crear:

- Un Web Service Node.js
- Una base PostgreSQL en Render

Flujo sugerido:

1. Sube este proyecto a GitHub.
2. En Render, crea el servicio usando el Blueprint del repositorio.
3. Espera a que Render cree el Web Service y la base de datos.
4. Verifica el endpoint `/api/health`.
5. Ejecuta `npm run prisma:seed` una vez si quieres datos iniciales.

Nota:

- En este proyecto el comando de arranque ejecuta `prisma migrate deploy` antes de iniciar la app, lo que funciona bien para un despliegue simple.
- Segun la documentacion actual de Render, el `preDeployCommand` es la opcion recomendada para migraciones, pero esa capacidad esta orientada a web services de pago. Si luego pasas a un plan pago, conviene mover las migraciones a `preDeployCommand`.

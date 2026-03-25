import type { Request, Response } from "express";

import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userQuerySchema
} from "../schemas/user.schemas";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from "../services/user.service";

export async function handleListUsers(request: Request, response: Response) {
  const filters = userQuerySchema.parse(request.query);
  const result = await listUsers(filters);

  response.json(result);
}

export async function handleGetUser(request: Request, response: Response) {
  const { id } = userIdSchema.parse(request.params);
  const user = await getUserById(id);

  response.json({
    data: user
  });
}

export async function handleCreateUser(request: Request, response: Response) {
  const payload = createUserSchema.parse(request.body);
  const user = await createUser(payload);

  response.status(201).json({
    message: "Usuario creado correctamente",
    data: user
  });
}

export async function handleUpdateUser(request: Request, response: Response) {
  const { id } = userIdSchema.parse(request.params);
  const payload = updateUserSchema.parse(request.body);
  const user = await updateUser(id, payload);

  response.json({
    message: "Usuario actualizado correctamente",
    data: user
  });
}

export async function handleDeleteUser(request: Request, response: Response) {
  const { id } = userIdSchema.parse(request.params);
  await deleteUser(id);

  response.status(204).send();
}

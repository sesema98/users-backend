import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type UserQueryInput
} from "../schemas/user.schemas";
import { HttpError } from "../utils/http-error";

function buildWhereClause(filters: UserQueryInput): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  const searchTerm = filters.search?.trim();
  if (searchTerm) {
    where.OR = [
      { firstName: { contains: searchTerm, mode: "insensitive" } },
      { lastName: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } }
    ];
  }

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

function mapKnownPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new HttpError(409, "Ya existe un usuario con ese correo");
    }

    if (error.code === "P2025") {
      throw new HttpError(404, "Usuario no encontrado");
    }
  }

  throw error;
}

export async function listUsers(filters: UserQueryInput) {
  const where = buildWhereClause(filters);
  const skip = (filters.page - 1) * filters.pageSize;

  const [items, total, totalUsers, activeUsers, pendingUsers] =
    await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: {
          [filters.sortBy]: filters.sortOrder
        },
        skip,
        take: filters.pageSize
      }),
      prisma.user.count({ where }),
      prisma.user.count(),
      prisma.user.count({ where: { status: "active" } }),
      prisma.user.count({ where: { status: "pending" } })
    ]);

  return {
    data: items,
    meta: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      hasNextPage: skip + items.length < total,
      hasPreviousPage: filters.page > 1
    },
    summary: {
      totalUsers,
      activeUsers,
      pendingUsers
    }
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  return user;
}

export async function createUser(payload: CreateUserInput) {
  try {
    return await prisma.user.create({
      data: payload
    });
  } catch (error) {
    mapKnownPrismaError(error);
  }
}

export async function updateUser(id: string, payload: UpdateUserInput) {
  try {
    return await prisma.user.update({
      where: { id },
      data: payload
    });
  } catch (error) {
    mapKnownPrismaError(error);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error) {
    mapKnownPrismaError(error);
  }
}

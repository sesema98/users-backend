import type {
  ApiEnvelope,
  User,
  UserFilters,
  UserPayload,
  UsersResponse
} from "../types";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  ""
) ?? "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  const payload = (await response
    .json()
    .catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "No fue posible completar la operacion",
      response.status
    );
  }

  return payload as T;
}

function buildQueryString(filters: UserFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    pageSize: String(filters.pageSize),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  });

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.role !== "all") {
    params.set("role", filters.role);
  }

  if (filters.status !== "all") {
    params.set("status", filters.status);
  }

  return params.toString();
}

export function getUsers(filters: UserFilters) {
  return apiFetch<UsersResponse>(`/api/users?${buildQueryString(filters)}`);
}

export async function createUser(payload: UserPayload) {
  const response = await apiFetch<ApiEnvelope<User>>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export async function updateUser(id: string, payload: UserPayload) {
  const response = await apiFetch<ApiEnvelope<User>>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export function deleteUser(id: string) {
  return fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE"
  }).then(async (response) => {
    if (!response.ok) {
      const payload = (await response
        .json()
        .catch(() => null)) as { message?: string } | null;
      throw new ApiError(
        payload?.message ?? "No fue posible eliminar el usuario",
        response.status
      );
    }
  });
}

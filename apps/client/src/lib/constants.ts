import type { UserRole, UserStatus, UserSortField } from "../types";

export const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Consulta" }
];

export const statusOptions: Array<{ value: UserStatus; label: string }> = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "pending", label: "Pendiente" }
];

export const sortOptions: Array<{ value: UserSortField; label: string }> = [
  { value: "createdAt", label: "Fecha de creacion" },
  { value: "updatedAt", label: "Ultima actualizacion" },
  { value: "firstName", label: "Nombre" },
  { value: "lastName", label: "Apellido" },
  { value: "email", label: "Correo" }
];

export const defaultFilters = {
  search: "",
  role: "all",
  status: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  pageSize: 8
} as const;

export function getRoleLabel(role: UserRole) {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}

export function getStatusLabel(status: UserStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

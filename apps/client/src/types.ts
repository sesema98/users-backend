export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "inactive" | "pending";
export type UserSortField =
  | "createdAt"
  | "updatedAt"
  | "firstName"
  | "lastName"
  | "email";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
  };
}

export interface UserFilters {
  search: string;
  role: UserRole | "all";
  status: UserStatus | "all";
  sortBy: UserSortField;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  notes?: string;
}

export interface ApiEnvelope<T> {
  message?: string;
  data: T;
}

export interface FlashMessage {
  kind: "success" | "error";
  text: string;
}

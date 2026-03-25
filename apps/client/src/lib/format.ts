import type { User } from "../types";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium"
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function getUserFullName(user: Pick<User, "firstName" | "lastName">) {
  return `${user.firstName} ${user.lastName}`;
}

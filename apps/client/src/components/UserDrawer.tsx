import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { roleOptions, statusOptions } from "../lib/constants";
import type { User, UserPayload } from "../types";

const userFormSchema = z.object({
  firstName: z.string().trim().min(2, "Ingresa al menos 2 caracteres"),
  lastName: z.string().trim().min(2, "Ingresa al menos 2 caracteres"),
  email: z.string().trim().email("Ingresa un correo valido"),
  phone: z.string().trim().max(30, "Maximo 30 caracteres").optional(),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive", "pending"]),
  notes: z.string().trim().max(300, "Maximo 300 caracteres").optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserDrawerProps {
  isOpen: boolean;
  selectedUser: User | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: UserPayload) => Promise<void>;
}

const defaultValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "viewer",
  status: "pending",
  notes: ""
};

function getValuesFromUser(user: User): UserFormValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    status: user.status,
    notes: user.notes ?? ""
  };
}

export function UserDrawer({
  isOpen,
  selectedUser,
  isSaving,
  onClose,
  onSubmit
}: UserDrawerProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset(selectedUser ? getValuesFromUser(selectedUser) : defaultValues);
  }, [isOpen, reset, selectedUser]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay" role="presentation">
      <aside className="drawer">
        <div className="panel-header">
          <div>
            <h2>{selectedUser ? "Editar usuario" : "Nuevo usuario"}</h2>
            <p>
              {selectedUser
                ? "Actualiza los datos almacenados en la tabla users."
                : "Registra un nuevo usuario con validaciones basicas."}
            </p>
          </div>
          <button className="button button-ghost" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>

        <form
          className="drawer-form"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit({
              ...values,
              phone: values.phone?.trim() || "",
              notes: values.notes?.trim() || ""
            });
          })}
        >
          <label className="field">
            <span>Nombre</span>
            <input {...register("firstName")} placeholder="Lucia" />
            {errors.firstName ? <small>{errors.firstName.message}</small> : null}
          </label>

          <label className="field">
            <span>Apellido</span>
            <input {...register("lastName")} placeholder="Vega" />
            {errors.lastName ? <small>{errors.lastName.message}</small> : null}
          </label>

          <label className="field">
            <span>Correo</span>
            <input {...register("email")} placeholder="lucia@example.com" type="email" />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>

          <label className="field">
            <span>Telefono</span>
            <input {...register("phone")} placeholder="+51 999 111 222" />
            {errors.phone ? <small>{errors.phone.message}</small> : null}
          </label>

          <div className="form-row">
            <label className="field">
              <span>Rol</span>
              <select {...register("role")}>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estado</span>
              <select {...register("status")}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Notas</span>
            <textarea
              {...register("notes")}
              placeholder="Observaciones o contexto del usuario"
              rows={4}
            />
            {errors.notes ? <small>{errors.notes.message}</small> : null}
          </label>

          <div className="drawer-actions">
            <button className="button button-ghost" onClick={onClose} type="button">
              Cancelar
            </button>
            <button className="button button-primary" disabled={isSaving} type="submit">
              {isSaving ? "Guardando..." : selectedUser ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

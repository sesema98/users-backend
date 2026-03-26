import { getRoleLabel, getStatusLabel } from "../lib/constants";
import { formatDate, getUserFullName } from "../lib/format";
import type { User, UserFilters, UsersResponse } from "../types";

interface UsersTableProps {
  users: User[];
  filters: UserFilters;
  meta?: UsersResponse["meta"];
  isLoading: boolean;
  isFetching: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
}

function StatusPill({ label, tone }: { label: string; tone: string }) {
  return <span className={`pill pill-${tone}`}>{label}</span>;
}

function getInitials(user: Pick<User, "firstName" | "lastName">) {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

function renderSkeletonRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={`skeleton-${index}`}>
      <td colSpan={6}>
        <div className="skeleton-row" />
      </td>
    </tr>
  ));
}

export function UsersTable({
  users,
  filters,
  meta,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  onPageChange
}: UsersTableProps) {
  const currentPage = meta?.page ?? filters.page;
  const pageSize = meta?.pageSize ?? filters.pageSize;
  const visibleStart = users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const visibleEnd = users.length > 0 ? visibleStart + users.length - 1 : 0;

  return (
    <section className="panel table-panel" id="collection">
      <div className="panel-header table-header">
        <div>
          <span className="panel-tag">Collection</span>
          <h2>Usuarios en escena</h2>
          <p>
            Pagina {currentPage} de {meta?.totalPages ?? 1}
          </p>
        </div>
        <div className="table-status-block">
          {isFetching && !isLoading ? <span className="sync-badge">Actualizando</span> : null}
          {meta ? (
            <span className="pagination-summary">
              Mostrando {visibleStart}-{visibleEnd} de {meta.total}
            </span>
          ) : null}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contacto</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? renderSkeletonRows()
              : users.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      <div className="identity-row">
                        <div className="user-avatar">{getInitials(user)}</div>
                        <div className="name-cell">
                          <span className="row-kicker">
                            Ficha {String((currentPage - 1) * pageSize + index + 1).padStart(2, "0")}
                          </span>
                          <strong>{getUserFullName(user)}</strong>
                          <span>{user.notes || "Sin notas registradas"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                        <span>{user.phone || "Sin telefono"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <StatusPill
                        label={getStatusLabel(user.status)}
                        tone={user.status}
                      />
                    </td>
                    <td>
                      <div className="date-block">
                        <strong>{formatDate(user.updatedAt)}</strong>
                        <span>Creado {formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-inline">
                        <button
                          className="button button-ghost"
                          onClick={() => onEdit(user)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="button button-danger"
                          onClick={() => onDelete(user)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && users.length === 0 ? (
        <div className="empty-state">
          <strong>No hay resultados</strong>
          <p>Ajusta los filtros o crea un nuevo usuario en la tabla.</p>
        </div>
      ) : null}

      <div className="pagination">
        <div className="pagination-summary">
          {meta ? (
            <span>
              {meta.total} resultado{meta.total === 1 ? "" : "s"} en esta lectura
            </span>
          ) : null}
        </div>

        <div className="actions-inline">
          <button
            className="button button-ghost"
            disabled={!meta?.hasPreviousPage}
            onClick={() => onPageChange((meta?.page ?? 1) - 1)}
            type="button"
          >
            Anterior
          </button>
          <button
            className="button button-ghost"
            disabled={!meta?.hasNextPage}
            onClick={() => onPageChange((meta?.page ?? 1) + 1)}
            type="button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}

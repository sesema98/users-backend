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
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <h2>Listado</h2>
          <p>
            Pagina {meta?.page ?? filters.page} de {meta?.totalPages ?? 1}
          </p>
        </div>
        {isFetching && !isLoading ? <span className="sync-badge">Actualizando</span> : null}
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
              : users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="name-cell">
                        <strong>{getUserFullName(user)}</strong>
                        <span>{user.notes || "Sin notas registradas"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                        <span>{user.phone || "Sin telefono"}</span>
                      </div>
                    </td>
                    <td>{getRoleLabel(user.role)}</td>
                    <td>
                      <StatusPill
                        label={getStatusLabel(user.status)}
                        tone={user.status}
                      />
                    </td>
                    <td>{formatDate(user.updatedAt)}</td>
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
              {meta.total} resultado{meta.total === 1 ? "" : "s"}
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

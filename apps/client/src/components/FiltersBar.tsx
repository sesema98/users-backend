import { roleOptions, sortOptions, statusOptions } from "../lib/constants";
import type { UserFilters } from "../types";

interface FiltersBarProps {
  filters: UserFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (nextFilters: Partial<UserFilters>) => void;
  onReset: () => void;
}

export function FiltersBar({
  filters,
  searchValue,
  onSearchChange,
  onFiltersChange,
  onReset
}: FiltersBarProps) {
  return (
    <section className="panel filters-panel">
      <div className="panel-header">
        <div>
          <h2>Explorar usuarios</h2>
          <p>Busca por nombre, apellido, correo o telefono.</p>
        </div>
        <button className="button button-ghost" onClick={onReset} type="button">
          Limpiar filtros
        </button>
      </div>

      <div className="filters-grid">
        <label className="field">
          <span>Buscar</span>
          <input
            placeholder="Ej. camila o ejemplo.com"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Rol</span>
          <select
            value={filters.role}
            onChange={(event) =>
              onFiltersChange({
                role: event.target.value as UserFilters["role"]
              })
            }
          >
            <option value="all">Todos</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Estado</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({
                status: event.target.value as UserFilters["status"]
              })
            }
          >
            <option value="all">Todos</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Ordenar por</span>
          <select
            value={filters.sortBy}
            onChange={(event) =>
              onFiltersChange({
                sortBy: event.target.value as UserFilters["sortBy"]
              })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Direccion</span>
          <select
            value={filters.sortOrder}
            onChange={(event) =>
              onFiltersChange({
                sortOrder: event.target.value as UserFilters["sortOrder"]
              })
            }
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </label>
      </div>
    </section>
  );
}

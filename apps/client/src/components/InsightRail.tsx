import { getRoleLabel, getStatusLabel, sortOptions } from "../lib/constants";
import type { UserFilters } from "../types";

interface InsightRailProps {
  filters: UserFilters;
  hasError: boolean;
  isFetching: boolean;
  totalUsers: number;
  pendingUsers: number;
  visibleUsers: number;
}

function getSystemLabel(hasError: boolean, isFetching: boolean) {
  if (hasError) {
    return "requiere revision";
  }

  if (isFetching) {
    return "sincronizando";
  }

  return "estable";
}

export function InsightRail({
  filters,
  hasError,
  isFetching,
  totalUsers,
  pendingUsers,
  visibleUsers
}: InsightRailProps) {
  const activeSignals: string[] = [];

  if (filters.search.trim()) {
    activeSignals.push(`Busqueda: "${filters.search.trim()}"`);
  }

  if (filters.role !== "all") {
    activeSignals.push(`Rol: ${getRoleLabel(filters.role)}`);
  }

  if (filters.status !== "all") {
    activeSignals.push(`Estado: ${getStatusLabel(filters.status)}`);
  }

  const currentSortLabel =
    sortOptions.find((option) => option.value === filters.sortBy)?.label ?? filters.sortBy;

  activeSignals.push(
    `${currentSortLabel} ${filters.sortOrder === "asc" ? "ascendente" : "descendente"}`
  );

  let suggestion = "La coleccion esta lista para seguir creciendo con perfiles nuevos.";

  if (pendingUsers > 0) {
    suggestion = `Hay ${pendingUsers} usuarios pendientes. Prioriza una ronda de activacion.`;
  } else if (totalUsers === 0) {
    suggestion = "Aun no hay registros. Crea el primer usuario para encender el tablero.";
  } else if (visibleUsers < totalUsers) {
    suggestion = "Estas viendo una vista recortada. Ajusta filtros para abrir mas contexto.";
  }

  return (
    <aside className="insight-rail">
      <section className="rail-panel rail-panel-feature">
        <span className="panel-tag">Signal map</span>
        <h2>Lectura instantanea</h2>
        <p>
          Un resumen rapido de la coleccion actual para que el panel no se sienta
          como una tabla muda.
        </p>

        <div className="rail-meter">
          <span>Salud operativa</span>
          <strong>{getSystemLabel(hasError, isFetching)}</strong>
        </div>

        <div className="rail-grid">
          <article>
            <span>Total</span>
            <strong>{totalUsers}</strong>
          </article>
          <article>
            <span>Visibles</span>
            <strong>{visibleUsers}</strong>
          </article>
          <article>
            <span>Pendientes</span>
            <strong>{pendingUsers}</strong>
          </article>
        </div>
      </section>

      <section className="rail-panel">
        <span className="panel-tag">Modo actual</span>
        <h3>Lectura de filtros</h3>
        <div className="rail-tags">
          {activeSignals.map((signal) => (
            <span className="signal-tag" key={signal}>
              {signal}
            </span>
          ))}
        </div>
      </section>

      <section className="rail-panel rail-panel-note">
        <span className="panel-tag">Siguiente gesto</span>
        <h3>Donde meter mano ahora</h3>
        <p>{suggestion}</p>
      </section>
    </aside>
  );
}

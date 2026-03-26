interface HeaderProps {
  onCreate: () => void;
  totalUsers: number;
  pendingUsers: number;
  visibleUsers: number;
  isFetching: boolean;
}

export function Header({
  onCreate,
  totalUsers,
  pendingUsers,
  visibleUsers,
  isFetching
}: HeaderProps) {
  return (
    <section className="hero">
      <div className="hero-copy-wrap">
        <div className="eyebrow-row">
          <span className="eyebrow">Users control room</span>
          <span className="hero-live">
            <span className="hero-live-dot" />
            {isFetching ? "Sincronizando" : "Pulso estable"}
          </span>
        </div>

        <h1>
          Convierte la tabla <em>users</em> en una portada operativa, no en otro
          admin igual al resto.
        </h1>
        <p className="hero-copy">
          Alta, edicion, eliminacion, busqueda, filtros y paginacion dentro de una
          interfaz con mas caracter visual y una lectura rapida del sistema.
        </p>

        <div className="hero-actions">
          <button className="button button-primary" onClick={onCreate} type="button">
            Crear usuario
          </button>
          <a className="button button-secondary" href="#collection">
            Ver coleccion
          </a>
        </div>
      </div>

      <div className="hero-board">
        <div className="hero-board-top">
          <span className="hero-board-label">Snapshot</span>
          <span className="hero-board-code">live</span>
        </div>

        <div className="hero-board-number">{totalUsers}</div>
        <p className="hero-board-copy">Registros orbitando dentro del sistema.</p>

        <div className="hero-stack">
          <article className="hero-stat hero-stat-light">
            <span>En foco</span>
            <strong>{visibleUsers}</strong>
          </article>
          <article className="hero-stat hero-stat-dark">
            <span>Pendientes</span>
            <strong>{pendingUsers}</strong>
          </article>
          <article className="hero-stat hero-stat-outline">
            <span>Modo</span>
            <strong>{isFetching ? "sync" : "steady"}</strong>
          </article>
        </div>
      </div>
    </section>
  );
}

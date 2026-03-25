interface HeaderProps {
  onCreate: () => void;
}

export function Header({ onCreate }: HeaderProps) {
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">CRUD de usuarios</span>
        <h1>Administra la tabla `users` desde una interfaz lista para desplegar.</h1>
        <p className="hero-copy">
          El panel incluye alta, edicion, eliminacion, busqueda, filtros,
          paginacion y estados visuales conectados al backend de Node.
        </p>
      </div>
      <div className="hero-actions">
        <button className="button button-primary" onClick={onCreate} type="button">
          Nuevo usuario
        </button>
      </div>
    </section>
  );
}

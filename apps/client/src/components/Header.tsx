interface HeaderProps {
  onCreate: () => void;
}

export function Header({ onCreate }: HeaderProps) {
  return (
    <section className="hero">
      <div className="hero-copy-wrap hero-copy-simple">
        <span className="eyebrow">CRUD de usuarios</span>
        <h1>Panel de gestion de usuarios</h1>
        <p className="hero-copy">
          Administra la tabla <strong>users</strong> con operaciones basicas:
          crear, editar, eliminar, buscar y filtrar registros.
        </p>

        <div className="hero-actions">
          <button className="button button-primary" onClick={onCreate} type="button">
            Crear usuario
          </button>
        </div>
      </div>
    </section>
  );
}

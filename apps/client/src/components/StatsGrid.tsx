interface StatsGridProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  visibleUsers: number;
}

export function StatsGrid({
  totalUsers,
  activeUsers,
  pendingUsers,
  visibleUsers
}: StatsGridProps) {
  const items = [
    {
      label: "Usuarios totales",
      value: totalUsers,
      tone: "sun",
      note: "Masa completa del directorio."
    },
    {
      label: "Usuarios activos",
      value: activeUsers,
      tone: "mint",
      note: "Perfiles listos para operar."
    },
    {
      label: "Pendientes",
      value: pendingUsers,
      tone: "sand",
      note: "Registros a revisar o activar."
    },
    {
      label: "En pantalla",
      value: visibleUsers,
      tone: "ink",
      note: "Capa visible bajo los filtros."
    }
  ];

  return (
    <section className="stats-grid">
      {items.map((item, index) => (
        <article className={`stat-card stat-card-${item.tone}`} key={item.label}>
          <div className="stat-card-top">
            <span>{item.label}</span>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </div>
          <strong>{item.value}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </section>
  );
}

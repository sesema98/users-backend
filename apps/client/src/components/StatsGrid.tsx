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
    { label: "Usuarios totales", value: totalUsers, tone: "sun" },
    { label: "Usuarios activos", value: activeUsers, tone: "mint" },
    { label: "Pendientes", value: pendingUsers, tone: "sand" },
    { label: "En pantalla", value: visibleUsers, tone: "ink" }
  ];

  return (
    <section className="stats-grid">
      {items.map((item) => (
        <article className={`stat-card stat-card-${item.tone}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

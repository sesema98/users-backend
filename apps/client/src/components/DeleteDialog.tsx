import { getUserFullName } from "../lib/format";
import type { User } from "../types";

interface DeleteDialogProps {
  user: User | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteDialog({
  user,
  isDeleting,
  onCancel,
  onConfirm
}: DeleteDialogProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="overlay" role="presentation">
      <div className="dialog">
        <span className="panel-tag">Accion critica</span>
        <h2>Eliminar usuario</h2>
        <p className="dialog-copy">Esta accion elimina el registro de la tabla users.</p>

        <div className="dialog-highlight">{getUserFullName(user)}</div>

        <p className="dialog-copy">Esta accion no se puede deshacer.</p>

        <div className="drawer-actions">
          <button className="button button-ghost" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button
            className="button button-danger"
            disabled={isDeleting}
            onClick={() => {
              void onConfirm();
            }}
            type="button"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState, useDeferredValue, startTransition } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { Header } from "./components/Header";
import { InsightRail } from "./components/InsightRail";
import { StatsGrid } from "./components/StatsGrid";
import { FiltersBar } from "./components/FiltersBar";
import { UsersTable } from "./components/UsersTable";
import { UserDrawer } from "./components/UserDrawer";
import { DeleteDialog } from "./components/DeleteDialog";
import {
  ApiError,
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from "./lib/api";
import { defaultFilters } from "./lib/constants";
import type { FlashMessage, User, UserFilters, UserPayload } from "./types";

function App() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<UserFilters>({
    ...defaultFilters
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  const deferredSearch = useDeferredValue(searchInput);

  useEffect(() => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        search: deferredSearch,
        page: 1
      }));
    });
  }, [deferredSearch]);

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFlashMessage(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  const usersQuery = useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    placeholderData: keepPreviousData
  });

  const saveUserMutation = useMutation({
    mutationFn: async ({
      userId,
      payload
    }: {
      userId?: string;
      payload: UserPayload;
    }) => {
      if (userId) {
        return updateUser(userId, payload);
      }

      return createUser(payload);
    },
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      setDrawerOpen(false);
      setSelectedUser(null);
      setFlashMessage({
        kind: "success",
        text: variables.userId
          ? "Usuario actualizado correctamente."
          : "Usuario creado correctamente."
      });
    },
    onError: (error) => {
      setFlashMessage({
        kind: "error",
        text:
          error instanceof ApiError
            ? error.message
            : "No fue posible guardar el usuario."
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      setFlashMessage({
        kind: "success",
        text: "Usuario eliminado correctamente."
      });
      setUserToDelete(null);
    },
    onError: (error) => {
      setFlashMessage({
        kind: "error",
        text:
          error instanceof ApiError
            ? error.message
            : "No fue posible eliminar el usuario."
      });
    }
  });

  const summary = usersQuery.data?.summary;
  const users = usersQuery.data?.data ?? [];

  const visibleUsers = useMemo(() => users.length, [users]);

  function updateFilters(nextFilters: Partial<UserFilters>, resetPage = true) {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        ...nextFilters,
        page: resetPage ? 1 : nextFilters.page ?? current.page
      }));
    });
  }

  async function handleSaveUser(payload: UserPayload) {
    await saveUserMutation.mutateAsync({
      userId: selectedUser?.id,
      payload
    });
  }

  return (
    <main className="app-shell">
      <div className="noise-layer" />
      <div className="orb orb-coral" />
      <div className="orb orb-mint" />
      <div className="orb orb-ink" />
      <div className="grid-overlay" />

      <div className="content">
        <Header
          isFetching={usersQuery.isFetching}
          onCreate={() => {
            setSelectedUser(null);
            setDrawerOpen(true);
          }}
          pendingUsers={summary?.pendingUsers ?? 0}
          totalUsers={summary?.totalUsers ?? 0}
          visibleUsers={visibleUsers}
        />

        {flashMessage ? (
          <div className={`flash flash-${flashMessage.kind}`}>{flashMessage.text}</div>
        ) : null}

        <section className="workspace-grid">
          <div className="workspace-main">
            <StatsGrid
              activeUsers={summary?.activeUsers ?? 0}
              pendingUsers={summary?.pendingUsers ?? 0}
              totalUsers={summary?.totalUsers ?? 0}
              visibleUsers={visibleUsers}
            />

            <FiltersBar
              filters={filters}
              searchValue={searchInput}
              totalResults={usersQuery.data?.meta.total ?? 0}
              onFiltersChange={(nextFilters) => updateFilters(nextFilters)}
              onReset={() => {
                setSearchInput("");
                setFilters({ ...defaultFilters });
              }}
              onSearchChange={setSearchInput}
            />

            {usersQuery.isError ? (
              <section className="panel error-panel">
                <span className="panel-tag">Sistema</span>
                <strong>No se pudo cargar la lista de usuarios.</strong>
                <p>
                  {usersQuery.error instanceof ApiError
                    ? usersQuery.error.message
                    : "Verifica la conexion al backend y a la base de datos."}
                </p>
              </section>
            ) : null}

            <UsersTable
              filters={filters}
              isFetching={usersQuery.isFetching}
              isLoading={usersQuery.isLoading}
              meta={usersQuery.data?.meta}
              onDelete={(user) => setUserToDelete(user)}
              onEdit={(user) => {
                setSelectedUser(user);
                setDrawerOpen(true);
              }}
              onPageChange={(page) => updateFilters({ page }, false)}
              users={users}
            />
          </div>

          <InsightRail
            filters={filters}
            hasError={usersQuery.isError}
            isFetching={usersQuery.isFetching}
            pendingUsers={summary?.pendingUsers ?? 0}
            totalUsers={summary?.totalUsers ?? 0}
            visibleUsers={visibleUsers}
          />
        </section>
      </div>

      <UserDrawer
        isOpen={drawerOpen}
        isSaving={saveUserMutation.isPending}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSaveUser}
        selectedUser={selectedUser}
      />

      <DeleteDialog
        isDeleting={deleteUserMutation.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={async () => {
          if (!userToDelete) {
            return;
          }

          await deleteUserMutation.mutateAsync(userToDelete.id);
        }}
        user={userToDelete}
      />
    </main>
  );
}

export default App;

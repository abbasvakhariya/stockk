import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "owner" | "manager" | "staff";
export type User = { id: string; name: string; email: string; role: Role };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (role: Role) => void;
  logout: () => void;
  users: UserWithPassword[];
  upsertUser: (u: UserWithPassword) => void;
  deleteUser: (id: string) => void;
};

export type UserWithPassword = User & { password: string };

const SESSION_KEY = "sf_session";
const USERS_KEY = "sf_users";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: UserWithPassword[] = [
  {
    id: "u_owner",
    name: "Store Owner",
    email: "owner@example.com",
    password: "owner123",
    role: "owner",
  },
  {
    id: "u_manager",
    name: "Store Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "manager",
  },
  {
    id: "u_staff",
    name: "Staff Member",
    email: "staff@example.com",
    password: "staff123",
    role: "staff",
  },
];

function readUsers(): UserWithPassword[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return defaultUsers;
  try {
    const parsed = JSON.parse(raw) as UserWithPassword[];
    return parsed.length ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

function writeUsers(users: UserWithPassword[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserWithPassword[]>(readUsers());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    writeUsers(users);
  }, [users]);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const sessionUser = JSON.parse(raw) as User;
        setUser(sessionUser);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) return false;
    const info: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(info));
    setUser(info);
    return true;
  };

  const loginAs = (role: Role) => {
    const found =
      users.find((u) => u.role === role) ??
      defaultUsers.find((u) => u.role === role)!;
    const info: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(info));
    setUser(info);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const upsertUser = (u: UserWithPassword) => {
    setUsers((prev) => {
      const idx = prev.findIndex((x) => x.id === u.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = u;
        return next;
      }
      return [...prev, { ...u, id: crypto.randomUUID() }];
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    const current = user && user.id === id;
    if (current) logout();
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginAs,
      logout,
      users,
      upsertUser,
      deleteUser,
    }),
    [user, loading, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

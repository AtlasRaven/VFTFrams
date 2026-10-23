import { create } from "zustand";
import type { User } from "../types";

function isStoredUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  return (
    "id" in value &&
    typeof value.id === "number" &&
    "fullName" in value &&
    typeof value.fullName === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "phoneNumber" in value &&
    typeof value.phoneNumber === "string" &&
    "role" in value &&
    (value.role === "ADMIN" ||
      value.role === "CUSTOMER" ||
      value.role === "STAFF")
  );
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("vft_token");
    localStorage.removeItem("vft_refresh_token");
    localStorage.removeItem("vft_user");
  } catch (error) {
    console.error("Unable to clear the persisted authentication session.", error);
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  loadFromStorage: () => void;
  hasRole: (roles: User["role"] | User["role"][]) => boolean;
  hasPermission: (roles: User["role"] | User["role"][]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  hasHydrated: false,

  login: (token: string, user: User, refreshToken?: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vft_token", token);
        if (refreshToken) {
          localStorage.setItem("vft_refresh_token", refreshToken);
        }
        localStorage.setItem("vft_user", JSON.stringify(user));
      } catch (error) {
        console.error("Unable to persist the authentication session.", error);
      }
    }
    set({
      token,
      refreshToken: refreshToken || null,
      user,
      isAuthenticated: true,
      hasHydrated: true,
    });
  },

  logout: () => {
    clearStoredSession();
    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: true,
    });
  },

  updateUser: (updatedFields: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedFields };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vft_user", JSON.stringify(newUser));
      } catch (error) {
        console.error("Unable to persist the updated user session.", error);
      }
    }
    set({ user: newUser });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") {
      set({ hasHydrated: true });
      return;
    }
    let storedToken: string | null = null;
    let storedRefresh: string | null = null;
    let storedUser: string | null = null;
    try {
      storedToken = localStorage.getItem("vft_token");
      storedRefresh = localStorage.getItem("vft_refresh_token");
      storedUser = localStorage.getItem("vft_user");
      if (storedToken?.split(".").length === 3 && storedUser) {
        const parsedUser: unknown = JSON.parse(storedUser);
        if (isStoredUser(parsedUser)) {
          set({
            token: storedToken,
            refreshToken: storedRefresh,
            user: parsedUser,
            isAuthenticated: true,
            hasHydrated: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Unable to restore the persisted authentication session.", error);
    }
    clearStoredSession();
    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: true,
    });
  },

  hasRole: (roles: User["role"] | User["role"][]) => {
    const currentUser = get().user;
    if (!currentUser) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(currentUser.role);
  },

  hasPermission: (roles: User["role"] | User["role"][]) => {
    return get().hasRole(roles);
  },
}));

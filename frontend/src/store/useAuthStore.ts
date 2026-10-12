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
    localStorage.removeItem("vft_user");
  } catch (error) {
    console.error("Unable to clear the persisted authentication session.", error);
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hasHydrated: false,

  login: (token: string, user: User) => {
    if (user.role !== "ADMIN") {
      throw new Error("Tài khoản chưa được cấp quyền quản trị.");
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vft_token", token);
        localStorage.setItem("vft_user", JSON.stringify(user));
      } catch (error) {
        console.error("Unable to persist the authentication session.", error);
      }
    }
    set({ token, user, isAuthenticated: true, hasHydrated: true });
  },

  logout: () => {
    clearStoredSession();
    set({ token: null, user: null, isAuthenticated: false, hasHydrated: true });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") {
      set({ hasHydrated: true });
      return;
    }
    let storedToken: string | null;
    let storedUser: string | null;
    try {
      storedToken = localStorage.getItem("vft_token");
      storedUser = localStorage.getItem("vft_user");
      if (storedToken?.split(".").length === 3 && storedUser) {
        const parsedUser: unknown = JSON.parse(storedUser);
        if (isStoredUser(parsedUser) && parsedUser.role === "ADMIN") {
          set({
            token: storedToken,
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
    set({ token: null, user: null, isAuthenticated: false, hasHydrated: true });
  },
}));

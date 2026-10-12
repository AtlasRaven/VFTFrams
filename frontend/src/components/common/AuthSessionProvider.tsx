"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Chỉ thực thi ở phía Client sau khi component đã mounted thành công
    useAuthStore.getState().loadFromStorage();
  }, []);

  return <>{children}</>;
}

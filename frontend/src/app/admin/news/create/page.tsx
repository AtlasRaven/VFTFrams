"use client";

import React from "react";
import { RoleGuard } from "../../../../components/auth/RoleGuard";
import { NewsForm } from "../../../../components/admin/NewsForm";

export default function CreateNewsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewsForm />
      </div>
    </RoleGuard>
  );
}

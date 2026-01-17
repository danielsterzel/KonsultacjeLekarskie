export const isAdmin = (email?: string | null) =>
  email?.includes("admin") ?? false;

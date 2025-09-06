import type { Role } from "@/context/auth";

export function roleHome(role: Role) {
  switch (role) {
    case "owner":
      return "/owner/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "staff":
    default:
      return "/staff/dashboard";
  }
}

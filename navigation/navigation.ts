import { LayoutDashboard, User, WorkflowIcon } from "lucide-react";

export const routeConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Designation",
    path: "/designation",
    icon: WorkflowIcon,
    subject: "designation",
    action: "read",
  },
  {
    title: "Designation Options",
    path: "/module",
    icon: User,
    subject: "modules",
    action: "read",
  },
];

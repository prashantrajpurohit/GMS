import { LayoutDashboard, User, WorkflowIcon } from "lucide-react";

export const routeConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    subject: "dashboard",
  },
  {
    title: "Designation",
    path: "/designation",
    icon: WorkflowIcon,
    subject: "designation",
  },
  {
    title: "Designation Options",
    path: "/module",
    icon: User,
    subject: "modules",
  },
];

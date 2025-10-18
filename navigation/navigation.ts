import { ChartColumn, CreditCard, LayoutDashboard, NotepadText, Settings, UserCog, Users } from "lucide-react";

export const routeConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    subject: "dashboard",
  },
  {
    title: "Members",
    path: "/members",
    icon: Users,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Staff",
    path: "/staff",
    icon: UserCog,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Payments",
    path: "/payments",
    icon: CreditCard,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Plans",
    path: "/plans",
    icon: NotepadText,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Reports",
    path: "/reports",
    icon: ChartColumn,
    subject: "dashboard",
    action: "read",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    subject: "dashboard",
    action: "read",
  },


];

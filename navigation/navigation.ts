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
    subject: "members",
    action: "read",
  },
  {
    title: "Staff",
    path: "/staff",
    icon: UserCog,
    subject: "staff",
    action: "read",
  },
  {
    title: "Payments",
    path: "/payments",
    icon: CreditCard,
    subject: "payments",
    action: "read",
  },
  {
    title: "Plans",
    path: "/plans",
    icon: NotepadText,
    subject: "plans",
    action: "read",
  },
  {
    title: "Reports",
    path: "/reports",
    icon: ChartColumn,
    subject: "reports",
    action: "read",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    subject: "settings",
    action: "read",
  },


];

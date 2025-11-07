"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routeConfig } from "@/navigation/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/reduxStore";

const data = {
  user: {
    name: "aakash",
    email: "aakash@example.com",
    avatar: "",
  },
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: routeConfig,
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const theme = useTheme().theme;
  const userData = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user
  );
  console.log(userData, "userData");

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-10"
            >
              <span>
                <Image
                  src={`/images/logo/${
                    theme == "dark"
                      ? "gms_logo_white.png"
                      : "gms_logo_black.png"
                  }`}
                  alt=""
                  width={50}
                  height={80}
                />
                <span className="text-xl font-bold">GYM FREAKY</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

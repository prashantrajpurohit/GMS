import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StoreRootState } from "@/reduxstore/reduxStore";
import { UserDataType } from "@/types/types";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
export default function UserLayout({ children }: { children: ReactNode }) {
  const user = useSelector(
    (state: StoreRootState) =>
      state?.data?.userdata?.user as UserDataType | null
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader name={user?.gymName} />
        <span style={{ padding: "20px" }}>{children}</span>
      </SidebarInset>
    </SidebarProvider>
  );
}

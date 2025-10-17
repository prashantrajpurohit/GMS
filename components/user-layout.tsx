import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
export default function UserLayout({
  allowedOptions,
  children,
}: {
  allowedOptions: string[];
  children: ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" allowedOptions={allowedOptions} />
      <SidebarInset>
        <SiteHeader />
        <span style={{ padding: "20px" }}>{children}</span>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight, LucideProps } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { getUserOptions } from "@/app/action/auth";

interface SingleNav {
  title: string;
  path: string;
  icon: React.ComponentType<LucideProps>;
  subject: string;
  children?:
    | undefined
    | {
        title: string;
        path: string;
        icon: React.ComponentType<LucideProps>;

        subject: string;
        action: string;
      }[];
}

interface Navitems {
  items: SingleNav[];
}

export function NavMain({ items }: Navitems) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allowedOptions, setAllowedOptions] = useState<string[]>([]);

  const handleClick = (path: string) => {
    router.replace(path);
  };
  const updatedItems = items.filter((item) =>
    allowedOptions.includes(item.subject)
  );
  useEffect(() => {
    getUserOptions()
      .then((options) => {
        setAllowedOptions(options);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get options:", err);
        setIsLoading(false);
      });
  }, []);
  const HasNoChild = (item: SingleNav) => {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          style={{ cursor: "pointer" }}
          onClick={() => handleClick(item.path)}
          tooltip={item.title}
          isActive={!!(item.path === pathname)}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const HaveChild = (item: SingleNav) => {
    return (
      <Collapsible
        style={{ cursor: "pointer" }}
        key={item.title}
        asChild
        defaultOpen={true}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              style={{ cursor: "pointer" }}
            >
              <item.icon />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.children?.map((subItem) => (
                  <Fragment key={subItem.title}>{HasNoChild(subItem)}</Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {updatedItems.map((item) => (
              <Fragment key={item?.title}>
                {!!item.children?.length ? HaveChild(item) : HasNoChild(item)}
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

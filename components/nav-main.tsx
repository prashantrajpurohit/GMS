"use client"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { Fragment } from "react"
import Icon from "@/components/tabler-icon"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAbility } from "@/hooks/use-ability"

interface SingleNav {
  title: string;
  path: string;
  icon: string;
  subject: string;
  action: string;
  children?: undefined | {
    title: string;
    path: string;
    icon: string;
    subject: string;
    action: string;
  }[]

}

interface Navitems {
  items: SingleNav[]
}



export function NavMain({ items }: Navitems) {
  const router = useRouter()
  const pathname = usePathname()
  const { ability } = useAbility()

  const handleClick = (path: string) => {
    router.replace(path);
  };

  const HasNoChild = (item: SingleNav) => {
    if (ability?.can(item.action, item.subject)) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton style={{cursor:"pointer"}} onClick={() => handleClick(item.path)} tooltip={item.title} isActive={!!(item.path === pathname)}>
            <Icon icon={item.icon} />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

  }

  const HaveChild = (item: SingleNav) => {
    if (ability?.can(item.action, item.subject)) {
      return (
        <Collapsible
        style={{cursor:"pointer"}}
          key={item.title}
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} style={{cursor:"pointer"}}>
                <Icon icon={item.icon} />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.children?.map((subItem) => (
                    <Fragment key={subItem.title}>
                      {HasNoChild(subItem)}
                    </Fragment>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }
  }

  return (<>
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Fragment key={item?.title}>
              {!!(item.children?.length) ? HaveChild(item) : HasNoChild(item)}
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

  </>)
}


{/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
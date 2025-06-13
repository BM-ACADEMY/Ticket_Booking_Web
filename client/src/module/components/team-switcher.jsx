"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar()
  const [activeTeam] = React.useState(teams[0])

  if (!activeTeam) return null

  const renderLogo = (logo, className, alt = "") => {
    return typeof logo === "string" ? (
      <img src={logo} alt={alt} className={`${className} object-cover shrink-0`} />
    ) : (
      React.createElement(logo, { className: `${className} shrink-0` })
    )
  }

  return (
    <SidebarMenu style={{ backgroundColor: "royalblue" }}>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className=" text-sidebar-primary-foreground flex items-center justify-center rounded-lg overflow-hidden w-8 h-8 shrink-0">
            {renderLogo(activeTeam.logo, "w-7 h-7", activeTeam.name)}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-white hover:text-black transition-colors duration-200">
            <span className="truncate font-medium"> {activeTeam.name} </span>
            <span className="truncate text-xs"> {activeTeam.plan} </span>
          </div>

        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

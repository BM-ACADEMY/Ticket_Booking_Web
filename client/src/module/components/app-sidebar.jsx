"use client"

import {
  SquareTerminal,
  ScanQrCode ,Ticket ,Calendar,
  NotebookPen,Users,
} from "lucide-react"

import Logo1 from "@/assets/images/logo1.jpg";

import { NavMain } from "@/module/components/nav-main"
import { NavUser } from "@/module/components/nav-user"
import { TeamSwitcher } from "@/module/components/team-switcher"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Bmtechx",
    email: "bmtechx@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Pegasus",
      logo: Logo1,
      plan: "Enterprise",
    }
  ],
  // navMain: [
  //   {
  //     title: "Dashboard",
  //     url: "#",
  //     icon: SquareTerminal,
  //     isActive: true,
  //   },
  //   {
  //     title: "Ticket Booking",
  //     url: "#",
  //     icon: Ticket,
  //   },
  //   {
  //     title: "QR Scanner",
  //     url: "#",
  //     icon: ScanQrCode ,
  //   },
  //   {
  //     title: "Events",
  //     url: "#",
  //     icon: Calendar ,
  //   },
  //   {
  //     title: "Attendance List",
  //     url: "#",
  //     icon: NotebookPen ,
  //     items: [
  //       {
  //         title: "Customers Attendance",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "New Members",
  //     url: "#",
  //     icon: Users ,
  //     items: [
  //       {
  //         title: "Admin",
  //         url: "#",
  //       },
  //       {
  //         title: "Sub Admin",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],

  navMain: [
  {
    title: "Dashboard",
    url: "/", // homepage
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Ticket Booking",
    url: "/ticket-booking",
    icon: Ticket,
  },
  {
    title: "QR Scanner",
    url: "/qr-scanner",
    icon: ScanQrCode,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Attendance List",
    url: "#",
    icon: NotebookPen,
    items: [
      {
        title: "Customers Attendance",
        url: "/attendance-list/customers",
      },
    ],
  },
  {
    title: "New Members",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Admin",
        url: "/new-members/admin",
      },
      {
        title: "Sub Admin",
        url: "/new-members/sub-admin",
      },
    ],
  },
]

}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

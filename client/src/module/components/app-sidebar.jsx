"use client"

import {
  SquareTerminal,
  ScanQrCode ,Ticket ,Calendar,
  NotebookPen,Users,Tag
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
import { useAuth } from "@/module/context/AuthContext"

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

  navMain: [
  {
    title: "Dashboard",
    url: "/", // homepage
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Ticket Booking",
    url: "#",
    icon: Ticket,
     items: [
      {
        title: "Sell Tickets",
        url: "/Ticket-Booking/ticket-booking",
      },
      {
        title: "Ticket List",
        url: "/Ticket-Booking/ticket-booking-list",
      },
    ],
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
    title: "Brands",
    url: "/brand",
    icon: Tag,
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
  const { user } = useAuth();
  console.log("AppSidebar user:", user);
  
  const role = user?.role?.name
  // Filter navMain based on role
  const getFilteredNavMain = () => {
    if (role === "Admin") {
      return data.navMain // Admin sees all links
    } else if (role === "Checker") {
      return data.navMain.filter((item) =>
        ["QR Scanner", "Attendance List"].includes(item.title)
      )
    } else if (role === "subAdmin") {
      return data.navMain.filter((item) =>
        ["Dashboard", "Ticket Booking", "Events", "QR Scanner", "Attendance List"].includes(item.title)
      )
    }
    return [] // Default: return empty array if role is undefined
  }

  const filteredNavMain = getFilteredNavMain()
  return (
    <Sidebar collapsible="icon" {...props}  style={{backgroundColor:"royalblue"}}>
      <SidebarHeader  style={{backgroundColor:"royalblue"}}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent  style={{backgroundColor:"royalblue"}}>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter  style={{backgroundColor:"royalblue"}}>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import React from "react"
import { AppSidebar } from "@/module/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, Link } from "react-router-dom"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Search } from "lucide-react"

import { useAuth } from "@/module/context/AuthContext"
import logo2 from "@/assets/images/logo4.png"

const breadcrumbNameMap = {
  dashboard: "Dashboard",
  "ticket-booking": "Ticket Booking",
  "qr-scanner": "QR Scanner",
  events: "Events",
  "attendance-list": "Attendance List",
  "new-members": "New Members",
  admin: "Admin",
  "sub-admin": "Sub Admin",
}

const formatSegment = (segment) => {
  return breadcrumbNameMap[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

const renderLogo = (logo, className, alt = "") => {
  return typeof logo === "string" ? (
    <img src={logo} alt={alt} className={`${className} object-cover shrink-0`} />
  ) : (
    React.createElement(logo, { className: `${className} shrink-0` })
  )
}

// your nav data (used in CommandDialog too)
const navMain = [
  { title: "Dashboard", url: "/" },
  { title: "Ticket Booking", url: "/ticket-booking" },
  { title: "QR Scanner", url: "/qr-scanner" },
  { title: "Events", url: "/events" },
  { title: "Customers Attendance", url: "/attendance-list/customers" },
  { title: "Admin", url: "/new-members/admin" },
  { title: "Sub Admin", url: "/new-members/sub-admin" },
]

const Page = ({ children }) => {
  const location = useLocation()
  const paths = location.pathname.split("/").filter(Boolean)
  const buildPath = (index) => "/" + paths.slice(0, index + 1).join("/")
  const [open, setOpen] = React.useState(false)
  const { user } = useAuth()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between gap-4 px-4 border-b">
          {/* Left: Breadcrumb + Sidebar Trigger */}
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {paths.length === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  paths.map((segment, index) => (
                    <BreadcrumbItem key={index}>
                      {index < paths.length - 1 ? (
                        <>
                          <BreadcrumbLink asChild>
                            <Link to={buildPath(index)}>
                              {formatSegment(segment)}
                            </Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      ) : (
                        <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Center: Command palette trigger */}
          <div className="flex justify-end sm:justify-center">
            {/* Search icon - visible only on mobile */}
            <Search
              className="block sm:hidden cursor-pointer size-5 text-gray-600"
              onClick={() => setOpen(true)}
            />

            {/* Optional: full search button for desktop (keep if needed) */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex w-full max-w-md text-left cursor-pointer text-sm border rounded-md text-gray-500 px-3 py-1.5 bg-background hover:bg-muted items-center gap-2"
            >
              <Search className="size-4 opacity-50" />
              <span>Search components...</span>
            </button>

            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Type to search..." />
              <CommandList>
                {navMain.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      window.location.href = item.url
                      setOpen(false)
                    }}
                  >
                    {item.title}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandDialog>
          </div>


          {/* Right: Logo + User name */}
          <div className="flex items-center gap-2">
           <div className="bg-sidebar-primary flex items-center brightness-150 justify-center rounded-lg overflow-hidden w-13 h-13 shrink-0">
              {renderLogo(`${logo2}`, "w-12 h-12", user?.name)}
            </div>
            {/* <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.name || "User"}
            </span> */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4">{children || <Outlet />}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page

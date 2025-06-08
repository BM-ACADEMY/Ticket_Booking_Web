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
import { Outlet,useLocation,Link } from "react-router-dom"



// Optional: Mapping for friendly names
const breadcrumbNameMap = {
  dashboard: "Dashboard",
  "ticket-booking": "Ticket Booking",
  "qr-scanner": "QR Scanner",
  events: "Events",
  "attendance-list": "Attendance List",
  "new-members": "New Members",
  admin: "Admin",
  "sub-admin": "Sub Admin",
};

const formatSegment = (segment) => {
  return breadcrumbNameMap[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
const Page=({children })=> {
const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean); // ['new-members', 'admin']

  const buildPath = (index) => "/" + paths.slice(0, index + 1).join("/");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
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
        </header>

        <main className="flex-1 p-4">{children || <Outlet />}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
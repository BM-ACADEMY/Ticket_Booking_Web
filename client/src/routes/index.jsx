// src/routes.jsx
import { Navigate } from "react-router-dom";
import Dashboard from "@/module/pages/Dashboard";
import TicketBooking from "@/module/pages/TicketBooking";
import QRScanner from "@/module/pages/QrScanner";
import Events from "@/module/pages/Events";
import CustomersAttendance from "@/module/pages/CustomerAttendanceList";
import AdminList from "@/module/pages/adminPage";
import SubAdminList from "@/module/pages/SubAdminPage";
import UserProfileUpdateForm from "@/module/pages/UserProfileUpdateForm";
import UserTicketTable from "@/module/pages/ticketBooking/TicketBookingList"
import ReportList from "@/module/pages/reports/ReportList";
import BrandList from "@/module/pages/brand/BrandList";
import CheckerPage from "@/module/pages/CheckerPage";
import BrandAssociateList from "@/module/pages/brand/BrandAssociateList";
import EventBrandList from "@/module/pages/brand/EventBrandList";

export const routes = [
  { path: "/", element: <Navigate to="/dashboard" /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/Ticket-Booking/ticket-booking", element: <TicketBooking /> },
  { path: "/Ticket-Booking/ticket-booking-list", element: <UserTicketTable /> },
  { path: "/qr-scanner", element: <QRScanner /> },
  { path: "/events", element: <Events /> },
  { path: "/attendance-list/customers", element: <CustomersAttendance /> },
  { path: "/new-members/admin", element: <AdminList /> },
  { path: "/new-members/sub-admin", element: <SubAdminList /> },
  { path: "/new-members/checker", element: <CheckerPage /> },
  {
    path: "/account",
    element: <UserProfileUpdateForm />,
  },
  {
    path: "/history",
    element: <ReportList />,
  },
  {
    path: "/Sponsors-Brand",
    element: <BrandList />,
  },
  {
    path: "/Associates-Brand",
    element: <BrandAssociateList />,
  },
  {
    path: "/Event-Brand",
    element: <EventBrandList />,
  },
  
];

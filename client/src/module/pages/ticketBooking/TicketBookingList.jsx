
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
  DrawerDescription, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import Calendar24 from "@/components/ui/calendar24";
import { CalendarIcon, Eye, Edit, Trash2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useAuth } from "@/module/context/AuthContext";
import TicketSheetWrapper from "@/module/pages/ticketBooking/TicketSheetWrapper";
import Pagination from "@/module/pages/pagination/Pagination";
import debounce from "lodash/debounce";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [dateTime, setDateTime] = useState({ date: null, time: "" });
  const [filter, setFilter] = useState("all");
  const [createdBy, setCreatedBy] = useState("none");
  const [creators, setCreators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role_id !== "1") {
      setCreatedBy(user._id);
    }
  }, [user]);

  const fetchCreators = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/admins-subadmins`,
        { withCredentials: true }
      );
      console.log("Creators response:", res.data);
      setCreators(res.data.data || []);
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Failed to load admins/subadmins");
    }
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        // filter: dateTime.date ? "all" : filter,
        name: nameFilter.trim(),
        createdBy: user && user.role_id !== "1" ? user._id : (createdBy !== "none" ? createdBy : ""),
        createdAt: dateTime.date ? format(dateTime.date, "yyyy-MM-dd") : "",
      };
      console.log("Fetching tickets with params:", params);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/fetch-all-users-with-filter`,
        { params, withCredentials: true }
      );
      console.log("API response:", res.data);
      setTickets(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch tickets");
      setTickets([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, nameFilter, dateTime.date, filter, createdBy, user]);

  const debouncedFetchTickets = useCallback(
    debounce(fetchTickets, 500),
    [fetchTickets]
  );

  useEffect(() => {
    fetchCreators();
    debouncedFetchTickets();
  }, [debouncedFetchTickets]);

  const handleResetFilters = () => {
    setNameFilter("");
    setDateTime({ date: null, time: "" });
    setFilter("all");
    if (user && user.role_id === "1") {
      setCreatedBy("none");
    }
    setPage(1);
  };

  const handleWhatsAppShare = (item, show) => {
    const foodCourtLink = "https://pegasuscmc.com";
    const ticketLink = show.qr_code_link || "https://pegasustickets.com";

    const formattedShowDate = new Date(show.datetime).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const formattedPaymentDate = new Date(show.payment_time || show.datetime).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const message = `
Hi ${item.name},
🌟 Welcome to Pegasus 2k25 – the crown jewel of CMC!

You have successfully booked ${show.ticket_count} ticket(s) for ${show.show_title}, scheduled on ${formattedShowDate} at ${show.location}.

🎟️ Please use the link below to access your e-ticket and show it at entry:
${ticketLink}
🔐 Entry is only allowed upon showing the e-ticket from the link.

✅ Your payment of ₹${show.amount} through ${show.payment_method} has been successfully received on ${formattedPaymentDate}.

📍 Event Venue: ${show.location}

🍴To enjoy exclusive access to the Pegasus Food Court throughout the week, please register here:
${foodCourtLink}

🍽️ Craving convenience? We also offer delivery to your doorstep! (Note: Available only for Bagayam and Rehab campuses.)
`;

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappURL = `https://wa.me/91${item.phone}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleView = (item) => {
    setSelected(item);
    setOpenDrawer(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (item, show) => {
    if (user && (user.role_id === "1" || show.created_by.id === user._id)) {
      setTicketToDelete({ item, ticket_id: show.ticket_id });
      setDeleteDialogOpen(true);
    } else {
      toast.error("You don't have permission to delete this ticket.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) return;
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/tickets/${ticketToDelete.ticket_id}`,
        { withCredentials: true }
      );
      toast.success("Ticket deleted successfully");
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      fetchTickets();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete ticket");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4">
      <h2
        className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}
      >
        Ticket Sales List
      </h2>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Input
          placeholder="Filter by user name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-48"
        />
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date Filter
          </Label>
          <Calendar24
            date={dateTime.date}
            setDate={(date) => setDateTime((prev) => ({ ...prev, date }))}
            time={dateTime.time}
            setTime={(time) => setDateTime((prev) => ({ ...prev, time }))}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user && user.role_id === "1" && (
          <Select value={createdBy} onValueChange={setCreatedBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Creators" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Creators</SelectItem>
              {creators.map((creators) => (
                <SelectItem key={creators._id} value={creators._id}>
                  {console.log("Rendering creator:", creators)}
                  {creators.name || "Unknown"} ({creators.role || "N/A"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <svg
            className="animate-spin h-8 w-8 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8a8 8 0 01-8-8z"
            />
          </svg>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Show</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-muted-foreground">
                      No tickets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((item) => {
                    const firstShow = item.shows[0];
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{item.name || "N/A"}</TableCell>
                        <TableCell>{item.phone || "N/A"}</TableCell>
                        <TableCell>{item.notes || "N/A"}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {firstShow?.show_logo && (
                            <img src={firstShow.show_logo} alt="Logo" className="w-6 h-6 rounded-full" />
                          )}
                          {firstShow?.show_title || "N/A"}
                        </TableCell>
                        <TableCell>{firstShow?.ticket_count || "N/A"}</TableCell>
                        <TableCell>₹{parseFloat(firstShow?.amount || 0).toFixed(2)}</TableCell>
                        <TableCell>{firstShow?.created_by?.name || "N/A"}</TableCell>
                        <TableCell>{firstShow?.created_by?.role || "N/A"}</TableCell>
                        <TableCell>
                          {item?.created_at
                            ? format(new Date(item.created_at), "dd-MMM-yyyy HH:mm:ss")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="secondary" size="icon" onClick={() => handleView(item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="secondary" size="icon" onClick={() => handleEditClick(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="secondary" size="icon" onClick={() => handleDeleteClick(item, firstShow)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="secondary" size="icon" onClick={() => handleWhatsAppShare(item, firstShow)}>
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <TicketSheetWrapper
            open={isSheetOpen}
            editData={selectedItem}
            onClose={() => setIsSheetOpen(false)}
          />
          <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerContent>
              <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle className="text-xl sm:text-2xl">User Ticket Details</DrawerTitle>
                  <DrawerDescription className="mb-4">All show bookings for this user.</DrawerDescription>
                </DrawerHeader>
                {selected && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                      <div><span className="font-medium text-black">Name:</span> {selected.name}</div>
                      <div><span className="font-medium text-black">Email:</span> {selected.email}</div>
                      <div><span className="font-medium text-black">Phone:</span> {selected.phone}</div>
                      <div><span className="font-medium text-black">Notes:</span> {selected.notes}</div>
                      <div><span className="font-medium text-black">QR ID:</span> {selected.qr_id}</div>
                    </div>
                    <div className="space-y-6">
                      {selected.shows.map((show, idx) => (
                        <Card key={idx} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="w-full sm:w-[250px]">
                            <img
                              src={show.show_logo}
                              alt="Show Logo"
                              className="rounded-lg border shadow w-full max-h-[200px] object-contain"
                            />
                          </div>
                          <div className="text-sm text-muted-foreground space-y-2">
                            <div><span className="font-medium text-black">Title:</span> {show.show_title}</div>
                            <div><span className="font-medium text-black">Location:</span> {show.location}</div>
                            <div><span className="font-medium text-black">Date:</span> {new Date(show.datetime).toLocaleString()}</div>
                            <div><span className="font-medium text-black">Tickets:</span> {show.ticket_count}</div>
                            <div><span className="font-medium text-black">Amount:</span> ₹{parseFloat(show.amount).toFixed(2)}</div>
                            <div><span className="font-medium text-black">Payment:</span> {show.payment_method}</div>
                            <div><span className="font-medium text-black">Created By:</span> {show.created_by?.name}</div>
                            <div><span className="font-medium text-black">Role:</span> {show.created_by?.role}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
                <DrawerFooter className="mt-6">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full sm:w-auto">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the ticket for "{ticketToDelete?.item.name}" for the show "{ticketToDelete?.item.shows[0]?.show_title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex justify-center mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TicketList;

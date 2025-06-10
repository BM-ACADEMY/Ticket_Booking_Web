import React, { useState, useEffect, useRef } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import axios from "axios";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer";

// Lucide Icons
import { Eye, Edit, Trash2 } from "lucide-react";
import TicketSheetWrapper from "@/module/pages/ticketBooking/TicketSheetWrapper";
import { toast } from "react-toastify";

const FILTER_OPTIONS = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
];

const UserTicketTable = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);


useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/fetch-all-users-with-filter`, {
                params: { page, filter },
            });
            setData(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            // toast.success("Data fetched successfully");
        } catch (err) {
            // toast.error("Failed to fetch data");
            console.error("Error fetching data", err);
        }
    };

    fetchData();
}, [filter, page]); // 👈 triggers re-fetch when either filter or page changes


    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsSheetOpen(true);
    };

    return (
        <>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Ticket Details</h2>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
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
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Show</TableHead>
                        <TableHead>Tickets</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data?.map((item, index) => {
                            const firstShow = item.shows[0]; // 🟡 Show only first
                            return (
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>{item.notes}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {firstShow?.show_logo && (
                                            <img src={firstShow.show_logo} alt="Logo" className="w-6 h-6 rounded-full" />
                                        )}
                                        {firstShow?.show_title}
                                    </TableCell>
                                    <TableCell>{firstShow?.ticket_count}</TableCell>
                                    <TableCell>₹{parseFloat(firstShow?.amount || 0).toFixed(2)}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            key={item._id}
                                            onClick={() => handleEditClick(item)}
                                            variant="secondary"
                                            size="icon"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        <Button variant="secondary" size="icon" cursor onClick={() => handleView(item)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>

            </Table>
            <TicketSheetWrapper
                open={isSheetOpen}
                editData={selectedItem}
                onClose={() => setIsSheetOpen(false)}
            />
            {/* Drawer View */}
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
                                    <div>
                                        <span className="font-medium text-black">Name:</span> {selected.name}
                                    </div>
                                    <div>
                                        <span className="font-medium text-black">Phone:</span> {selected.phone}
                                    </div>
                                    <div>
                                        <span className="font-medium text-black">Notes:</span> {selected.notes}
                                    </div>
                                    <div>
                                        <span className="font-medium text-black">QR ID:</span> {selected.qr_id}
                                    </div>
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


            <div className="flex justify-center mt-4">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div></>
    );
};

export default UserTicketTable;

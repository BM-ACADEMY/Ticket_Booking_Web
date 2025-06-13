"use client";

import { useState, useEffect, useRef } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventListTable({ onEdit }) {
    const [shows, setShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showToDelete, setShowToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShows = shows.slice(indexOfFirstItem, indexOfLastItem);
    const hasFetched = useRef(false);

    const totalPages = Math.ceil(shows.length / itemsPerPage);


    // Fetch all shows
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchShows = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`, {
                    withCredentials: true, // Include cookies for authentication
                });
                toast.success("Shows fetched successfully");
                setShows(response.data.data || []);
                console.log("Fetched shows:", response.data.data);

            } catch (error) {
                toast.error("Failed to fetch shows",
                );
                console.error("Fetch shows error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShows();
    }, []);

    // Handle delete confirmation
    const handleDelete = async () => {
        if (!showToDelete) return;

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/shows/delete-show/${showToDelete._id}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setShows((prev) => prev.filter((show) => show._id !== showToDelete._id));
                toast.success("Show deleted successfully");
            }

        } catch (error) {
            toast.error("Failed to delete show", {
                description:
                    error.response?.data?.message || "Something went wrong.",
            });
            console.error("Delete show error:", error);
        } finally {
            setDeleteDialogOpen(false);
            setShowToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="text-center p-6">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-6 p-2 rounded-sm text-white" style={{backgroundColor:"royalblue"}}>Event List</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Logo</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No shows found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentShows.map((show) => (
                                <TableRow key={show._id}>
                                    <TableCell>{show.title}</TableCell>
                                    <TableCell>{show.location}</TableCell>
                                    <TableCell>
                                        {new Date(show.datetime).toLocaleString()}
                                    </TableCell>
                                    <TableCell>₹ {parseFloat(show.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {show.logo ? (
                                            <img
                                                src={show.logo}
                                                alt={`${show.title} logo`}
                                                className="h-12 w-12 object-cover rounded"
                                            />
                                        ) : (
                                            "No logo"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(show)}
                                                title="Edit show"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setShowToDelete(show);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                title="Delete show"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-primary text-white" : ""
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the show "{showToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventListTable({ onEdit,refresh }) {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const hasFetched = useRef(false);

  const fetchShows = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows-for-event?page=${currentPage}&limit=${itemsPerPage}`,
        { withCredentials: true }
      );
      const { data } = response.data;
      setShows(data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      toast.success("Shows fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch shows");
      console.error("Fetch shows error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [currentPage, itemsPerPage,refresh]);

  const handleDelete = async () => {
    if (!showToDelete) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/shows/delete-show/${showToDelete._id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShows((prev) => prev.filter((show) => show._id !== showToDelete._id));
        toast.success("Show deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete show", {
        description: error.response?.data?.message || "Something went wrong.",
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
      <h2 className="text-2xl font-semibold text-center mb-6 p-2 rounded-sm text-white" style={{ backgroundColor: "#030049" }}>
        Event List
      </h2>

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
              shows.map((show) => (
                <TableRow key={show._id}>
                  <TableCell>{show.title}</TableCell>
                  <TableCell>{show.location}</TableCell>
                  <TableCell>{new Date(show.datetime).toLocaleString()}</TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => onEdit(show)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowToDelete(show);
                          setDeleteDialogOpen(true);
                        }}
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

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Records per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset page
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <button
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? "bg-primary text-white" : "hover:bg-muted"}`}
                  >
                    {i + 1}
                  </button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the show "{showToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

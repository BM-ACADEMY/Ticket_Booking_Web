
import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";

const CheckerList = ({ onEdit, onDelete, refresh }) => {
  const [checkers, setCheckers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  const fetchCheckers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/fetch-all-checkers`, {
        params: { page, limit: 10, name: nameFilter, phone: phoneFilter },
        withCredentials: true,
      });
      setCheckers(res.data.checkers || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch checkers:", err);
      toast.error(err.response?.data?.message || "Failed to load checkers");
      setCheckers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckers();
  }, [page, refresh, nameFilter, phoneFilter]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checker List</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Filter by phone"
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-4">
            <svg
              className="animate-spin h-8 w-8 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkers.length > 0 ? (
                  checkers.map((checker) => (
                    <TableRow key={checker._id}>
                      <TableCell>{checker.name}</TableCell>
                      <TableCell>{checker.email}</TableCell>
                      <TableCell>{checker.phone}</TableCell>
                      <TableCell>{checker.role_id}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => onEdit(checker)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => onDelete(checker._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No checkers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckerList;
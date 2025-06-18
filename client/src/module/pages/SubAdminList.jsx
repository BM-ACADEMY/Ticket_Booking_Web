
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

const SubAdminList = ({ onEdit, onDelete, refresh }) => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/fetch-all-subAdmins`, {
        params: { page, limit: 10, name: nameFilter, phone: phoneFilter },
        withCredentials: true,
      });
      setSubAdmins(res.data.subAdmins);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch sub-admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, [page, refresh, nameFilter, phoneFilter]);

 return (
  <Card>
    <CardContent className="p-4">
      {/* Title & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-semibold">SubAdmin List</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Filter by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full sm:w-48"
          />
          <Input
            placeholder="Filter by phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-4">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
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
          {/* Table with Horizontal Scroll on Small Screens */}
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
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
                {subAdmins.length > 0 ? (
                  subAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phone}</TableCell>
                      <TableCell>{admin.role_id}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => onEdit(admin)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => onDelete(admin._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No subAdmins found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

};

export default SubAdminList;
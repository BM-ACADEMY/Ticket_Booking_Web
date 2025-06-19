
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Calendar24 from "@/components/ui/calendar24";
import { CalendarIcon, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";

const CustomerAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [dateTime, setDateTime] = useState({ date: null, time: "" });

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        name: nameFilter,
        createdAt: dateTime.date ? format(dateTime.date, "yyyy-MM-dd") : "",
      };

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/attendance/fetch-all-attendance`,
        {
          params,
          withCredentials: true,
        }
      );

      const attendanceArray = res.data.attendance || [];
      setAttendances(attendanceArray);
      setTotalPages(res.data.pagination?.totalPages || 1);

      const initialEditState = {};
      attendanceArray.forEach((item) => {
        initialEditState[item._id] = {
          member_count: item.member_count,
          notes: item.notes || "",
          qr_valid: item.qr_valid,
        };
      });
      setEditableData(initialEditState);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message); // Debug log
      toast.error(error.response?.data?.message || "Failed to fetch data");
      setAttendances([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/attendance/update-attendance/${id}`,
        updatedFields,
        {
          withCredentials: true,
        }
      );
      toast.success("Updated successfully");
      fetchAttendances();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/attendance/delete-attendance/${confirmId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Deleted successfully");
      setConfirmId(null);
      fetchAttendances();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setDateTime({ date: null, time: "" });
    setPage(1);
  };

  useEffect(() => {
    fetchAttendances();
  }, [page, nameFilter, dateTime.date]);

  return (
    <div className="p-4">
      <h2
        className="text-xl font-semibold mb-4 text-center  text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}
      >
        Customer Attendance List
      </h2>
      <div className="flex items-center  gap-4 mb-4">
        <Input
          placeholder="Filter by user name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-48"
        />
        <div className="space-y-2">
          {/* <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date and Time
          </Label> */}
          <Calendar24
            date={dateTime.date}
            setDate={(date) => setDateTime((prev) => ({ ...prev, date }))}
            time={dateTime.time}
            setTime={(time) => setDateTime((prev) => ({ ...prev, time }))}
          />
        </div>
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <svg
            className="animate-spin h-8 w-8 text-gray-500"
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
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            />
          </svg>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Show</TableHead>
                <TableHead>Marked By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>QR Valid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length > 0 ? (
                attendances.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.user_id?.name || "N/A"}</TableCell>
                    <TableCell>{item.show_id?.title || "N/A"}</TableCell>
                    <TableCell>{item.marked_by_admin_id?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editableData[item._id]?.member_count || ""}
                        onChange={(e) =>
                          setEditableData((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              member_count: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editableData[item._id]?.notes || ""}
                        onChange={(e) =>
                          setEditableData((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              notes: e.target.value,
                            },
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={editableData[item._id]?.qr_valid || false}
                        onCheckedChange={(checked) =>
                          setEditableData((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              qr_valid: checked,
                            },
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdate(item._id, {
                            member_count: editableData[item._id]?.member_count,
                            notes: editableData[item._id]?.notes,
                            qr_valid: editableData[item._id]?.qr_valid,
                          })
                        }
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setConfirmId(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center mt-4">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>Confirm Delete</DialogHeader>
          <p>Are you sure you want to delete this attendance record?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
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
};

export default CustomerAttendanceList;
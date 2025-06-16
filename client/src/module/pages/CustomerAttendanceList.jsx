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
import { Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const CustomerAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const fetchAttendances = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/attendance/fetch-all-attendance`,
        {
          withCredentials: true,
        }
      );
      const attendanceArray = res.data.attendance;
      setAttendances(attendanceArray);

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
      toast.error("Failed to fetch data");
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

  useEffect(() => {
    fetchAttendances();
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm " style={{backgroundColor:"#030049"}}>Attendance List </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Show</TableHead>
            <TableHead>Marked By</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>QR Valid</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.user_id?.name || "N/A"}</TableCell>
              <TableCell>{item.show_id?.title || "N/A"}</TableCell>
              <TableCell>{item.marked_by_admin_id?.name || "N/A"}</TableCell>
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
          ))}
        </TableBody>
      </Table>

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
    </>
  );
};

export default CustomerAttendanceList;

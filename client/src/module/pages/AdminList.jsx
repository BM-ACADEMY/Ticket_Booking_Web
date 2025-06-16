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
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";

const AdminList = ({ onEdit, onDelete, refresh }) => {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/fetch-all-admin`, {
        withCredentials: true,
      });
      setAdmins(res.data || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      toast.error("Failed to load admins");
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [refresh]);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Admin List</h2>
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
            {admins.length > 0 ? (
              admins.map((admin) => (
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
                  No admins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminList;
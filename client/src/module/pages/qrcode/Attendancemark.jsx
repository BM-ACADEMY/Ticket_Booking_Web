import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUser } from "@/module/context/UserInfoContext";
import { motion } from "framer-motion";
import { useAuth } from "@/module/context/AuthContext";

const AttendanceMark = () => {
  const { user_id, show_id } = useParams();
  const { userInfo } = useUser();
  const { user } = useAuth();

  const [ticketCount, setTicketCount] = useState(0);
  const [memberCount, setMemberCount] = useState("");
  const [notes, setNotes] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading state

  // Check role and fetch attendance info
  useEffect(() => {
    if (!user) return; // Wait for user to load

    const validRoles = ["admin", "subadmin", "checker"];
    const userRole = user?.role?.name?.toLowerCase();

    console.log("User Role:", userRole);

    if (!userRole || !validRoles.includes(userRole)) {
      setIsAuthorized(false);
      toast.error("Access denied: You are not authorized to mark attendance.");
      return;
    }

    setIsAuthorized(true); // ✅ Authorized

    const fetchData = async () => {
      try {
        const ticketRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/tickets/count/${user_id}/${show_id}`
        );
        setTicketCount(ticketRes.data.ticket_count);

        const attRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/attendance/fetch-attendance-by-user-show/${user_id}/${show_id}`
        );
        if (attRes.data.attendance) {
          const { attendance: att } = attRes.data;
          setAttendance(att);
          setMemberCount(att.member_count);
          setNotes(att.notes ?? "");
        }
      } catch (err) {
        toast.error("Failed to load attendance info");
      }
    };

    fetchData();
  }, [user, user_id, show_id]);

  const handleMark = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/attendance/mark-attendance`,
        {
          user_id,
          show_id,
          marked_by_admin_id: user?._id,
          member_count: Number(memberCount),
          notes,
        }
      );

      toast.success("Attendance marked successfully");
      setAttendance(res.data.attendance);
    } catch (err) {
      toast.error("Error marking attendance");
    }
  };

  // 🔄 Loading state
  if (isAuthorized === null) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="p-4 text-center text-blue-600">Checking access...</Card>
      </div>
    );
  }

  // ❌ Unauthorized
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="p-4 text-red-600 font-medium text-center">
          ❌ You do not have permission to access this page.
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {userInfo && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="mb-4 p-4 space-y-2">
            <h2 className="text-lg font-semibold">User Details</h2>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p>
            <p><strong>Notes:</strong> {userInfo.notes || "N/A"}</p>
            <p><strong>QR ID:</strong> {userInfo.qr_id || "N/A"}</p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Mark Attendance</h2>

          <p><strong>Ticket Count:</strong> {ticketCount}</p>

          <Input
            type="number"
            min={0}
            max={ticketCount}
            placeholder="Enter member count"
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
          />

          <Input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-24 resize-none"
          />

          <Button onClick={handleMark}>Mark Attendance</Button>

          {attendance && (
            <motion.div
              className="text-sm text-green-600 pt-2 space-y-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2 }}
              viewport={{ once: true }}
            >
              <span>
                Attendance recorded for {attendance.member_count} members. QR Valid:{" "}
                {attendance.qr_valid ? "✅" : "❌"}
              </span>
              {attendance.notes && (
                <span className="block">
                  <strong>Notes:</strong> {attendance.notes}
                </span>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceMark;

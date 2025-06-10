import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const AttendanceMark = () => {
  const { user_id, show_id } = useParams();
  const [ticketCount, setTicketCount] = useState(0);
  const [memberCount, setMemberCount] = useState("");

  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Ticket Count
        const ticketRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/tickets/count/${user_id}/${show_id}`);
        setTicketCount(ticketRes.data.ticket_count);

        // 2. Get Existing Attendance
        const attRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/attendance/fetch-attendance-by-user-show/${user_id}/${show_id}`);
        if (attRes.data.attendance) {
          setAttendance(attRes.data.attendance);
          setMemberCount(attRes.data.attendance.member_count);
        }
      } catch (err) {
        toast.error("Failed to load attendance info");
      }
    };

    fetchData();
  }, [user_id, show_id]);

  const handleMark = async () => {
    try {
        console.log(ticketCount,"count");
        
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/attendance/mark-attendance`, {
        user_id,
        show_id,
        member_count: Number(memberCount),
      });   

      toast.success("Attendance marked successfully");
      setAttendance(res.data.attendance);
    } catch (err) {
      toast.error("Error marking attendance");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
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

        <Button onClick={handleMark}>Mark Attendance</Button>

        {attendance && (
          <p className="text-sm text-green-600 pt-2">
            Attendance recorded for {attendance.member_count} members. QR Valid:{" "}
            {attendance.qr_valid ? "✅" : "❌"}
          </p>
        )}
      </Card>
    </div>
  );
};

export default AttendanceMark;

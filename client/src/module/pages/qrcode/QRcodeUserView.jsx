import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import axios from "axios";

const QRCodeUserView = () => {
  const { qrcode } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/by-qrcode/${qrcode}`);
        setUserData(res.data.data);
      } catch (err) {
        toast.error("Error fetching user data");
      }
    };

    if (qrcode) fetchUserTickets();
  }, [qrcode]);

  if (!userData) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">User Info</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Notes:</strong> {userData.notes || "N/A"}</p>
        <p><strong>QR ID:</strong> {userData.qr_id}</p>
      </Card>

      {userData.shows?.map((show, index) => (
        <Card key={index} className="p-4 space-y-2 flex-row justify-between w-full">
          <div className="flex gap-4">
            {show.show_logo && (
              <img src={show.show_logo} alt="logo" className="w-20 h-20 object-contain rounded border" />
            )}
            <div className="text-sm space-y-1">
              <p><strong>Title:</strong> {show.show_title}</p>
              <p><strong>Location:</strong> {show.location}</p>
              <p><strong>Date:</strong> {new Date(show.datetime).toLocaleString()}</p>
              <p><strong>Tickets:</strong> {show.ticket_count}</p>
              <p><strong>Amount:</strong> ₹{parseFloat(show.amount).toFixed(2)}</p>
              <p><strong>Payment:</strong> {show.payment_method}</p>
            </div>
          </div>

          {/* QR Code that embeds user_id and show_id */}
          <div className="pt-4 text-center cursor-pointer" onClick={() => navigate(`/attendance-mark/${userData._id}/${show.show_id}`)}>
            <QRCode
              value={`${userData._id}:${show.show_id}`}
              size={100}
              style={{ height: "auto", maxWidth: "100%", width: "100px" }}
            />
            <p className="text-xs text-muted-foreground pt-2">Tap QR to mark attendance</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QRCodeUserView;

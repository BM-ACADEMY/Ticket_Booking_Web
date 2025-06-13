// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { toast } from "react-toastify";
// import QRCode from "react-qr-code";
// import axios from "axios";

// const QRCodeUserView = () => {
//   const { qrcode } = useParams();
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserTickets = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/by-qrcode/${qrcode}`);
//         setUserData(res.data.data);
//       } catch (err) {
//         toast.error("Error fetching user data");
//       }
//     };

//     if (qrcode) fetchUserTickets();
//   }, [qrcode]);

//   if (!userData) return <p className="text-center mt-10">Loading user info...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <Card className="p-4">
//         <h2 className="text-xl font-semibold mb-4">User Info</h2>
//         <p><strong>Name:</strong> {userData.name}</p>
//         <p><strong>Phone:</strong> {userData.phone}</p>
//         <p><strong>Notes:</strong> {userData.notes || "N/A"}</p>
//         <p><strong>QR ID:</strong> {userData.qr_id}</p>
//       </Card>

//       {userData.shows?.map((show, index) => (
//         <Card key={index} className="p-4 space-y-2 flex-row justify-between w-full">
//           <div className="flex gap-4">
//             {show.show_logo && (
//               <img src={show.show_logo} alt="logo" className="w-20 h-20 object-contain rounded border" />
//             )}
//             <div className="text-sm space-y-1">
//               <p><strong>Title:</strong> {show.show_title}</p>
//               <p><strong>Location:</strong> {show.location}</p>
//               <p><strong>Date:</strong> {new Date(show.datetime).toLocaleString()}</p>
//               <p><strong>Tickets:</strong> {show.ticket_count}</p>
//               <p><strong>Amount:</strong> ₹{parseFloat(show.amount).toFixed(2)}</p>
//               <p><strong>Payment:</strong> {show.payment_method}</p>
//             </div>
//           </div>

//           {/* QR Code that embeds user_id and show_id */}
//           <div className="pt-4 text-center cursor-pointer" onClick={() => navigate(`/attendance-mark/${userData._id}/${show.show_id}`)}>
//             <QRCode
//               value={`${userData._id}:${show.show_id}`}
//               size={100}
//               style={{ height: "auto", maxWidth: "100%", width: "100px" }}
//             />
//             <p className="text-xs text-muted-foreground pt-2">Tap QR to mark attendance</p>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default QRCodeUserView;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import axios from "axios";
import {
  Users,
  Ticket,
  Phone,
  Mail,
  Globe,
  Copyright,
  MessageSquare,
} from "lucide-react";
import logo2 from "@/assets/images/logo2.PNG";
import logo1 from "@/assets/images/PEGASUS.jpg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { useUser } from "@/module/context/UserInfoContext";
import { Handshake } from "lucide-react"



const sponsors = [
  {
    name: "Zomato",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfLa2X3zXtN8OjQ5uWn7XVJpAj3ZazuOsa4A&s",
  },
  {
    name: "Amazon",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfLa2X3zXtN8OjQ5uWn7XVJpAj3ZazuOsa4A&s",
  },
  {
    name: "Paytm",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfLa2X3zXtN8OjQ5uWn7XVJpAj3ZazuOsa4A&s",
  },
];

const associates = [
  {
    name: "Red FM (Malaysia)",
    logo: "https://logowik.com/content/uploads/images/red-fm7788.logowik.com.webp",
  },
  {
    name: "Uber",
    logo: "https://pngimg.com/uploads/uber/uber_PNG24.png",
  },
];

const UserViewPage = () => {
  const { qrcode } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { setUserInfo } = useUser();
  const [brands, setBrands] = useState();

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/by-qrcode/${qrcode}`
        );
        console.log(res, 'dat');

        setUserData(res.data.data);
        setUserInfo(res.data.data);
      } catch (err) {
        toast.error("Error fetching user data");
      }
    };

    if (qrcode) fetchUserTickets();
  }, [qrcode]);

  const fetchbrands = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/brands/fetch-all-brands`
      );
      console.log(res, 'brand');
      setBrands(res.data.data)
    } catch (err) {
      toast.error("Error fetching user data");
    }
  };
  useEffect(() => {
    fetchbrands()
  }, [])
  if (!userData)
    return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-800 ">
      {/* Header */}
      <header className="relative bg-white p-4">
        <div className="relative">
          <motion.img
            src={logo2}
            alt="Top Right Logo"
            className="absolute bg-black p-2 rounded-2xl top-0 right-0 w-16 h-16 object-contain"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </div>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <motion.img
            src={logo1}
            alt="Center Logo"
            className="w-full max-w-xs h-auto object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.h1
            className="text-4xl md:text-7xl font-bold text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            PEGASUS 2K25
          </motion.h1>
        </div>
      </header>

      {/* Sponsors */}
      <section className="py-20" style={{ backgroundColor: "royalblue" }}>
        <motion.h2
          className="text-center mb-10 text-3xl md:text-5xl font-semibold  text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 5 }}
        >
          🎉 Sponsors
        </motion.h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-8 px-4">
            {brands?.map((sponsor, i) => (
              <motion.div
                key={i}
                className="text-center space-y-4 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={sponsor.brandLogo}
                  alt={sponsor.brandName}
                  className="w-20 h-20 object-cover rounded-full mx-auto"
                />
                <p className="text-sm text-white font-medium">{sponsor.brandName}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>


      {/* Associates */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
        <motion.h2
          className="text-center text-3xl md:text-5xl font-bold mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🤝 Our Associates
        </motion.h2>
        <ScrollArea className="w-full">
          <div className="flex gap-8 px-6 py-4">
            {associates?.map((associate, i) => (
              <motion.div
                key={i}
                className="text-center space-y-3 min-w-[140px] p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={associate.logo}
                  alt={associate.name}
                  className="w-24 h-24 object-contain rounded-full mx-auto border-2 border-blue-200"
                />
                <p className="text-sm font-semibold text-gray-700">{associate.name}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-200" />
        </ScrollArea>
      </section>

      {/* User Info */}
      {/* User Info */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* User Info Card */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 ,delay:2}}
        >
          <Card className="p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" /> User Info
            </h2>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Notes:</strong> {userData.notes || "N/A"}</p>
            <p><strong>QR ID:</strong> {userData.qr_id}</p>
          </Card>
        </motion.div>

        {/* Show Cards */}
        {userData.shows?.map((show, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 2 }}
          >
            <Card className="p-6">
              <CardContent className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left: Show Info */}
                <motion.div
                  className="flex-1 space-y-2 text-sm"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                >
                  <p><strong>Title:</strong> {show.show_title}</p>
                  <p><strong>Location:</strong> {show.location}</p>
                  <p><strong>Date:</strong> {new Date(show.datetime).toLocaleString()}</p>
                  <p><strong>Tickets:</strong> {show.ticket_count}</p>
                  <p><strong>Amount:</strong> ₹{parseFloat(show.amount).toFixed(2)}</p>
                  <p><strong>Payment:</strong> {show.payment_method}</p>
                </motion.div>

                {/* Right: Logo & QR Code */}
                <motion.div
                  className="flex gap-4 items-center"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                >
                  {show.show_logo && (
                    <motion.img
                      src={show.show_logo}
                      alt="Show Logo"
                      className="w-24 h-24 object-contain rounded border border-gray-200"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    />
                  )}
                  <motion.div
                    className="text-center cursor-pointer"
                    onClick={() =>
                      navigate(`/attendance-mark/${userData._id}/${show.show_id}`)
                    }
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                  >
                    <QRCode
                      value={`${import.meta.env.VITE_FRONTEND_URL}/attendance-mark/${userData._id}/${show.show_id}`}
                      size={100}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100px",
                      }}
                    />
                    <p className="text-xs text-muted-foreground pt-2">
                      Tap QR to mark attendance
                    </p>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Tickets */}
        {userData.tickets && userData.tickets.length > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="w-5 h-5" /> Booked Ticket Details
              </h2>
              <div className="space-y-2">
                {userData.tickets.map((ticket, index) => (
                  <motion.div
                    key={index}
                    className="border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 2 }}
                  >
                    <div className="space-y-1">
                      <p><strong >Ticket ID:</strong> {ticket._id}</p>
                      <p><strong>Seat:</strong> {ticket.seat_number || "N/A"}</p>
                      <p><strong>Type:</strong> {ticket.ticket_type}</p>
                      <p><strong>Status:</strong> {ticket.status}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Amount:</strong> ₹{parseFloat(ticket.amount).toFixed(2)}</p>
                      <p><strong>Booked At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                      <p><strong>Show:</strong> {ticket.show_title}</p>
                      <p><strong>Location:</strong> {ticket.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>


      {/* Footer */}
      <footer className="border-t px-6 py-10 text-sm" style={{ backgroundColor: "royalblue" }}>
        <motion.div
          className="max-w-7xl mx-auto space-y-10 text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          viewport={{ once: true }}
        >
          {/* Line 1 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
            {/* Left Side: Title */}
            <motion.div
              className="md:w-1/3 space-y-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold">Any Queries?</h2>
              <p className="text-gray-100">Our Entertainment Incharges</p>
            </motion.div>

            {/* Center: Contacts */}
            <motion.div
              className="md:w-2/3 flex flex-col md:flex-row justify-center gap-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              {/* Gladwin */}
              <div className="text-center space-y-1">
                <p className="font-semibold">Gladwin Jeffery Felix</p>
                <a href="tel:+917397612973" className="flex items-center justify-center gap-2 text-blue-200 hover:text-white">
                  <Phone className="w-4 h-4" /> +91 73976 12973
                </a>
                <a href="https://wa.me/+917397612973" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-green-300 hover:text-white">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              {/* Jerry */}
              <div className="text-center space-y-1">
                <p className="font-semibold">Jerry Matthew</p>
                <a href="tel:+919698404696" className="flex items-center justify-center gap-2 text-blue-200 hover:text-white">
                  <Phone className="w-4 h-4" /> +91 96984 04696
                </a>
                <a href="https://wa.me/+919698404696" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-green-300 hover:text-white">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* Line 2 */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-200 gap-4">
            {/* Left: Email + Website */}
            <motion.div
              className="space-y-1"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              <a href="mailto:Pegasus2025entertainment@gmail.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="w-4 h-4" /> Pegasus2025entertainment@gmail.com
              </a>
              <a href="https://www.pegasuscmc.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <Globe className="w-4 h-4" /> www.pegasuscmc.com
              </a>
            </motion.div>

            {/* Center: Copyright */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.8 }}
            >
              <Copyright className="w-4 h-4" />
              <span>Pegasus 2025, CMC Vellore</span>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default UserViewPage;

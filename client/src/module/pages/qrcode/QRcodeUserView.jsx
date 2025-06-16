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
  Star,
  Handshake,
  Sparkles,
} from "lucide-react";
import logo2 from "@/assets/images/logo2.PNG";
import logo1 from "@/assets/images/PEGASUS.jpg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const UserViewPage = () => {
  const { qrcode } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [associateBrands, setAssociateBrands] = useState([]);
  const [eventBrands, setEventBrands] = useState([]);

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/by-qrcode/${qrcode}`
        );
        setUserData(res.data.data);
      } catch (err) {
        toast.error("Error fetching user data");
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/brands/fetch-all-brands`
        );
        setBrands(res.data.data);
      } catch (err) {
        toast.error("Error fetching brands");
      }
    };

    const fetchAssociateBrands = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/associate-brand/fetch-all-brand-associates`
        );
        setAssociateBrands(res.data.data);
      } catch (err) {
        toast.error("Error fetching associate brands");
      }
    };

    const fetchEventBrands = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/event-brand/fetch-all-event-brands`
        );
        setEventBrands(res.data.data);
      } catch (err) {
        toast.error("Error fetching event brands");
      }
    };

    if (qrcode) fetchUserTickets();
    fetchBrands();
    fetchAssociateBrands();
    fetchEventBrands();
  }, [qrcode]);

  if (!userData) {
    return <p className="text-center mt-10">Loading user info...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section (Unchanged) */}
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
            className="text-4xl md:text-7xl text-[#030049] font-bold text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            PEGASUS 2K25
          </motion.h1>
        </div>
      </header>

      {/* Sponsors Section */}
      <section className="py-12 bg-white">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Star className="w-6 h-6 text-yellow-500" /> Sponsors
        </motion.h2>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:flex md:flex-row gap-6 px-6">
            {brands?.map((sponsor, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center space-y-2 min-w-[150px] p-4 bg-gray-50 rounded-lg shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={sponsor.show_logo || sponsor.brandLogo}
                  alt={sponsor.brandName}
                  className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                />
              
                <p className="text-sm font-medium text-center">{sponsor.brandName}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-200" />
        </ScrollArea>
      </section>

      {/* Associates Brand Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Handshake className="w-6 h-6 text-blue-500" /> Associates Brand
        </motion.h2>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:flex md:flex-row gap-6 px-6">
            {associateBrands?.map((associate, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center space-y-2 min-w-[150px] p-4 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={associate.associateLogo || associate.associateLogo}
                  alt={associate.associateName}
                  className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                />
           
                <p className="text-sm font-medium text-center">{associate.associateName}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-200" />
        </ScrollArea>
      </section>

      {/* Event Brands Section */}
      <section className="py-12 bg-white">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-purple-500" /> Event Brands
        </motion.h2>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:flex md:flex-row gap-6 px-6">
            {eventBrands?.map((event, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center space-y-2 min-w-[150px] p-4 bg-gray-50 rounded-lg shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={event.eventBrandLogo || event.eventBrandLogo}
                  alt={event.eventBrandName}
                  className="w-36 h-36 object-contain rounded-lg border border-gray-200"
                />
             
                <p className="text-sm font-medium text-center">{event.eventBrandName}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-200" />
        </ScrollArea>
      </section>

      {/* User Info and Tickets Section */}
       <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* User Info Card (Unchanged) */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" /> User Info
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Notes:</strong> {userData.notes || "N/A"}</p>
              <p><strong>QR ID:</strong> {userData.qr_id?.length > 10 ? `${userData.qr_id.slice(0, 10)}...` : userData.qr_id}</p>
            </div>
          </Card>
        </motion.div>

        {/* Show Cards */}
        {userData.shows?.map((show, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className="p-3 bg-white shadow-lg">
              <CardContent className="flex flex-col gap-4">
                {/* Mobile View: Two Parts (Image+Details, QR Code) */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* Part 1: Image and Details */}
                  <div className="flex flex-row items-start gap-4 md:flex-1">
                    {/* Left: Show Logo */}
                    {show.show_logo && (
                      <motion.img
                        src={show.show_logo}
                        alt="Show Logo"
                        className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-lg border border-gray-200"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                    {/* Right: Show Info */}
                    <div className="flex-1 space-y-2 text-sm">
                      <p><strong>Title:</strong> {show.show_title}</p>
                      <p><strong>Location:</strong> {show.location}</p>
                      <p><strong>Date:</strong> {new Date(show.datetime).toLocaleString()}</p>
                      <p><strong>Tickets:</strong> {show.ticket_count}</p>
                      <p><strong>Amount:</strong> ₹{parseFloat(show.amount).toFixed(2)}</p>
                      <p><strong>Payment:</strong> {show.payment_method}</p>
                    </div>
                  </div>
                  {/* Desktop View: QR Code on Right */}
                  <motion.div
                    className="hidden md:flex md:items-center md:justify-end"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="text-center cursor-pointer">
                      <div className="inline-block bg-gray-100 p-2 rounded-lg">
                        <QRCode
                          value={`${import.meta.env.VITE_FRONTEND_URL}/attendance-mark/${userData._id}/${show.show_id}`}
                          size={150}
                          style={{
                            height: "100px",
                            width: "150px",
                            borderRadius: "8px",
                          }}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Tap QR to mark attendance
                      </p>
                    </div>
                  </motion.div>
                </div>
                {/* Part 2: QR Code (Mobile View, Centered) */}
                <motion.div
                  className="flex justify-center md:hidden mt-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-center cursor-pointer">
                    <div className="inline-block bg-gray-100 p-2 rounded-lg">
                      <QRCode
                        value={`${import.meta.env.VITE_FRONTEND_URL}/attendance-mark/${userData._id}/${show.show_id}`}
                        size={150}
                        style={{
                          height: "100px",
                          width: "150px",
                          borderRadius: "8px",
                        }}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tap QR to mark attendance
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Tickets Section (Unchanged) */}
        {userData.tickets && userData.tickets.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-blue-500" /> Booked Ticket Details
              </h2>
              <div className="space-y-4">
                {userData.tickets.map((ticket, index) => (
                  <motion.div
                    key={index}
                    className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="space-y-1 text-sm">
                      <p><strong>Ticket ID:</strong> {ticket._id}</p>
                      <p><strong>Seat:</strong> {ticket.seat_number || "N/A"}</p>
                      <p><strong>Type:</strong> {ticket.ticket_type}</p>
                      <p><strong>Status:</strong> {ticket.status}</p>
                    </div>
                    <div className="space-y-1 text-sm">
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
      <footer className="border-t bg-gradient-to-r from-[#030049] to-indigo-600 text-white px-6 py-10 text-sm">
        <motion.div
          className="max-w-7xl mx-auto space-y-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.div
              className="space-y-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold">Any Queries?</h2>
              <p>Our Entertainment Incharges</p>
            </motion.div>
            <motion.div
              className="flex flex-col md:flex-row justify-center gap-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center space-y-1">
                <p className="font-semibold">Gladwin Jeffery Felix</p>
                <a href="tel:+917397612973" className="flex items-center justify-center gap-2 text-blue-200 hover:text-white">
                  <Phone className="w-4 h-4" /> +91 73976 12973
                </a>
                <a href="https://wa.me/+917397612973" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-green-300 hover:text-white">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              className="space-y-1"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="mailto:Pegasus2025entertainment@gmail.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="w-4 h-4" /> Pegasus2025entertainment@gmail.com
              </a>
              <a href="https://www.pegasuscmc.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <Globe className="w-4 h-4" /> www.pegasuscmc.com
              </a>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Copyright className="w-4 h-4" />
              <span>bmtechx.in, {new Date().getFullYear()}</span>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default UserViewPage;
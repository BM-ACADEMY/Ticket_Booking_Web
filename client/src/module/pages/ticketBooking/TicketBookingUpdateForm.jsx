// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { IndianRupee, Wallet, User, Mail, Phone, StickyNote, CreditCard, ReceiptText } from "lucide-react";
// import { useAuth } from "@/module/context/AuthContext";
// import { se } from "date-fns/locale";
// import { toast } from "react-toastify";

// const TicketBookingUpdateForm = ({ shows, editData = null, onClose }) => {
//     const [userInfo, setUserInfo] = useState({
//         name: "",
//         phone: "",
//         notes: "",
//     });
//     const { user } = useAuth();
//     console.log(editData, "update form");

//     const [isEditMode, setIsEditMode] = useState(!!editData);
//     const [selectedShows, setSelectedShows] = useState([]);
//     const [allShows, setAllShows] = useState([]);
//     const [loadingShows, setLoadingShows] = useState(true);

//     const [loading, setLoading] = useState(false);
// const [paymentMethod, setPaymentMethod] = useState(""); // you already use this

//     useEffect(() => {
//         if (editData) {
//             setUserInfo({
//                 name: editData?.name || "",
//                 phone: editData?.phone || "",
//                 notes: editData?.notes || "",
//             });

//             setSelectedShows(
//                 editData.shows?.map((ticket) => ({
//                     _id: ticket.show_id,
//                     title: ticket.show_title,
//                     price: ticket.amount,
//                     ticket_count: ticket.ticket_count,
//                 })) || []
//             );
//         }
//     }, [editData]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserInfo((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleShowSelect = (show) => {
//         setSelectedShows((prev) => {
//             const exists = prev.find((s) => s._id === show._id);
//             if (exists) {
//                 // If already selected, remove it (uncheck)
//                 return prev.filter((s) => s._id !== show._id);
//             } else {
//                 // If not selected, add it
//                 return [...prev, { ...show, ticket_count: 1 }];
//             }
//         });
//     };

//     const handleTicketChange = (id, count) => {
//         setSelectedShows((prev) =>
//             prev.map((s) => (s._id === id ? { ...s, ticket_count: count } : s))
//         );
//     };

//     const calculateAmount = (price, count) => Number(price) * Number(count);

//     const totalAmount = selectedShows.reduce(
//         (acc, s) => acc + calculateAmount(s.price, s.ticket_count),
//         0
//     );

//     useEffect(() => {
//         const fetchShows = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`);
//                 setAllShows(res.data.data); // adjust if the data is nested differently
//                 toast.success("Shows fetched successfully!");
//             } catch (err) {

//                 toast.error("Failed to fetch shows.");
//                 console.error(err);
//             } finally {
//                 setLoadingShows(false);
//             }
//         };

//         fetchShows();
//     }, []);
//     const handleTicketCountChange = (showId, newCount) => {
//         if (newCount < 1) return; // Prevent invalid values

//         setSelectedShows((prev) =>
//             prev.map((s) =>
//                 s._id === showId ? { ...s, ticket_count: newCount } : s
//             )
//         );
//     };


//     const handleSubmit = async (method) => {
//         if (!userInfo.name || !userInfo.phone || selectedShows.length === 0) {
//             toast.error("Please fill all required fields and select at least one show.");
//             return;
//         }

//         try {
//             let userId;
//             // Update existing user
//             const userResponse = await axios.put(
//                 `${import.meta.env.VITE_BASE_URL}/users/update-user/${editData?._id}`,
//                 userInfo
//             );
//             userId = userResponse.data.data._id;
//             console.log();
//             toast.success("User information updated successfully!");

//             // Update each ticket individually
//             await Promise.all(
//                 editData.shows.map((s) =>
//                     axios.put(`${import.meta.env.VITE_BASE_URL}/tickets/update-ticket/${s.ticket_id}`, {
//                         user_id: userId,
//                         show_id: s._id,
//                         ticket_count: s.ticket_count,
//                         created_by: user?._id || "default-admin-id",
//                         amount: calculateAmount(s.amount, s.ticket_count),
//                         payment_method: method,
//                     })
//                 )
//             );

//             toast.success("Tickets updated successfully!");

//             onClose?.(); // Close the Sheet
//         } catch (err) {
//             const errorMessage =
//                 err.response?.data?.message || err.message || "Something went wrong";
//             toast.error(errorMessage);
//         }
//     };


//     return (
//         <div className="max-w-4xl mx-auto space-y-6">
//             <h2 className="text-2xl font-bold bg-[#fafafa] p-2 rounded-sm">🎟️ Book Tickets</h2>

//             {/* User Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <Label htmlFor="name" className="mb-3  flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         Name
//                     </Label>
//                     <Input
//                         id="name"
//                         name="name"
//                         value={userInfo.name}
//                         placeholder="Enter your name"
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>

//                 <div>
//                     <Label htmlFor="phone" className="mb-3  flex items-center gap-2">
//                         <Phone className="w-4 h-4" />
//                         Phone
//                     </Label>
//                     <Input
//                         id="phone"
//                         name="phone"
//                         placeholder="Enter your phone number"
//                         value={userInfo.phone}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </div>
//                 <div className="md:col-span-2">
//                     <Label htmlFor="notes" className="mb-3  flex items-center gap-2">
//                         <StickyNote className="w-4 h-4" />
//                         Notes
//                     </Label>
//                     <Textarea
//                         id="notes"
//                         placeholder="Any special requests or notes"
//                         name="notes"
//                         value={userInfo.notes}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//             </div>

//             {/* Show Selection */}
//             <div>
//                 <Label className="text-lg font-semibold mb-3 block">Select Shows</Label>
//                 {loadingShows ? (
//                     <p>Loading shows...</p>
//                 ) : (
//                     allShows.map((show) => {
//                         const isSelected = selectedShows.some((s) => s._id === show._id);
//                         const selectedShow = selectedShows.find((s) => s._id === show._id);

//                         return (
//                             <Card key={show._id} className="mb-4">
//                                 <CardContent className="space-y-3 py-4">
//                                     <div className="flex items-center justify-between">
//                                         <Label htmlFor={`show-${show._id}`} className="flex items-center gap-3 text-base font-medium">
//                                             <Checkbox
//                                                 id={`show-${show._id}`}
//                                                 className="cursor-pointer"
//                                                 checked={isSelected}
//                                                 onCheckedChange={(checked) => handleShowSelect(show, checked)}
//                                             />
//                                             {show.title} — ₹{show.price}
//                                         </Label>
//                                     </div>

//                                     {isSelected && (
//                                         <div className="flex flex-col">
//                                             <Label htmlFor={`ticket-count-${show._id}`} className="text-sm font-medium mb-1">
//                                                 Ticket Count
//                                             </Label>
//                                             <Input
//                                                 id={`ticket-count-${show._id}`}
//                                                 type="text" // changed from "number" to "text"
//                                                 value={selectedShow?.ticket_count || ""}
//                                                 onChange={(e) => {
//                                                     const val = e.target.value;
//                                                     if (/^\d*$/.test(val)) {
//                                                         // Only allow digits
//                                                         handleTicketCountChange(show._id, val === "" ? "" : parseInt(val, 10));
//                                                     }
//                                                 }}
//                                                 className="w-32"
//                                             />
//                                         </div>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         );
//                     })
//                 )}
//             </div>

//             {/* Total Amount */}
//             <div className="text-xl font-bold flex items-center gap-2">
//                 <IndianRupee className="w-5 h-5" />
//                 Total: ₹{totalAmount}
//             </div>

//             {/* Payment Buttons */}
//             <div className="flex gap-4 flex-wrap">
//                 <Button onClick={() => handleSubmit("GPay")} variant="default" className="flex items-center gap-2 cursor-pointer">
//                     <CreditCard className="w-4 h-4" />
//                     Pay with GPay
//                 </Button>
//                 <Button onClick={() => handleSubmit("Cash")} variant="outline" className="flex items-center gap-2 cursor-pointer">
//                     <Wallet className="w-4 h-4" />
//                     Cash Payment
//                 </Button>
//                 <Button onClick={() => handleSubmit("Mess Bill")} variant="secondary" className="flex items-center gap-2 cursor-pointer">
//                     <ReceiptText className="w-4 h-4" />
//                     Mess Bill
//                 </Button>
//             </div>
//         </div>
//     );
// }

// export default TicketBookingUpdateForm;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IndianRupee,
  Wallet,
  User,
  Phone,
  StickyNote,
  CreditCard,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "@/module/context/AuthContext";
import { toast } from "react-toastify";

const TicketBookingUpdateForm = ({ shows, editData = null, onClose }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [userId, setUserId] = useState(null); // Add userId state
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(!!editData);
  const [selectedShows, setSelectedShows] = useState([]);
  const [allShows, setAllShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Initialize form with editData
  useEffect(() => {
    if (editData) {
      setUserId(editData._id || null); // Set userId from editData
      setUserInfo({
        name: editData?.name || "",
        phone: editData?.phone || "",
        notes: editData?.notes || "",
      });
      setSelectedShows(
        editData.shows?.map((ticket) => ({
          _id: ticket.show_id,
          title: ticket.show_title,
          price: ticket.amount / ticket.ticket_count, // Correct price calculation
          ticket_count: ticket.ticket_count,
        })) || []
      );
      setPaymentMethod(editData.shows?.[0]?.payment_method || "");
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowSelect = (show) => {
    setSelectedShows((prev) => {
      const exists = prev.find((s) => s._id === show._id);
      if (exists) {
        return prev.filter((s) => s._id !== show._id);
      } else {
        return [...prev, { ...show, ticket_count: 1 }];
      }
    });
  };

  const handleTicketCountChange = (showId, newCount) => {
    if (newCount === "" || /^\d+$/.test(newCount)) {
      setSelectedShows((prev) =>
        prev.map((s) =>
          s._id === showId
            ? { ...s, ticket_count: newCount === "" ? "" : parseInt(newCount, 10) }
            : s
        )
      );
    }
  };

  const calculateAmount = (price, count) => Number(price) * Number(count || 0);

  const totalAmount = selectedShows.reduce(
    (acc, s) => acc + calculateAmount(s.price, s.ticket_count),
    0
  );

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`
        );
        setAllShows(res.data.data);
        // toast.success("Shows fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch shows.");
        console.error(err);
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, []);

 const handleUpdate = async (method, userId) => {
  if (!userInfo.name || !userInfo.phone || selectedShows.length === 0 || !method) {
    toast.error("Please fill all required fields, select at least one show, and choose a payment method.");
    return;
  }

  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
    toast.error("A valid user ID is required. Please select an existing user.");
    return;
  }

  if (!user?._id || !/^[0-9a-fA-F]{24}$/.test(user._id)) {
    toast.error("Invalid or missing admin ID. Please log in as an admin.");
    return;
  }

  setLoading(true);

  try {
    // Sanitize selectedShows
    const sanitizedShows = selectedShows.map((s) => ({
      _id: s._id,
      ticket_count: s.ticket_count,
      price: s.price,
    }));

    // Prepare payload
    const updatePayload = {
      userInfo: { ...userInfo },
      tickets: sanitizedShows.map((s) => ({
        show_id: s._id,
        ticket_count: s.ticket_count,
        amount: calculateAmount(s.price, s.ticket_count),
        payment_method: method,
        created_by: user._id,
      })),
    };


    // Call the update API
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/users/update-user/${userId}`,
      updatePayload
    );

    toast.success("User and tickets updated successfully!");
    // Reset form
    setUserInfo({ name: "", phone: "", notes: "" });
    setSelectedShows([]);
    setPaymentMethod("");
    setUserId(null);
    if (onClose) onClose();
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Something went wrong";
    console.error("Update error:", errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold bg-[#fafafa] p-2 rounded-sm">
        🎟️ {isEditMode ? "Update Tickets" : "Book Tickets"}
      </h2>

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={userInfo.name}
            placeholder="Enter your name"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={userInfo.phone}
            placeholder="Enter your phone number"
            onChange={handleInputChange}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes" className="mb-3 flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special requests or notes"
            value={userInfo.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Show Selection */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">Select Shows</Label>
        {loadingShows ? (
          <p>Loading shows...</p>
        ) : (
          allShows.map((show) => {
            const isSelected = selectedShows.some((s) => s._id === show._id);
            const selectedShow = selectedShows.find((s) => s._id === show._id);

            return (
              <Card key={show._id} className="mb-4">
                <CardContent className="space-y-3 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`show-${show._id}`} className="flex items-center gap-3">
                      <Checkbox
                        id={`show-${show._id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleShowSelect(show)}
                      />
                      {show.title} — ₹{show.price}
                    </Label>
                  </div>

                  {isSelected && (
                    <div>
                      <Label htmlFor={`ticket-count-${show._id}`} className="text-sm mb-1">
                        Ticket Count
                      </Label>
                      <Input
                        id={`ticket-count-${show._id}`}
                        type="text"
                        value={selectedShow?.ticket_count || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) {
                            handleTicketCountChange(show._id, val === "" ? "" : parseInt(val, 10));
                          }
                        }}
                        className="w-32"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Total */}
      <div className="text-xl font-bold flex items-center gap-2">
        <IndianRupee className="w-5 h-5" />
        Total: ₹{totalAmount}
      </div>

      {/* Payment Method */}
      <div className="flex gap-4 flex-wrap">
        {["GPay", "Cash", "Mess Bill"].map((method) => {
          const icons = {
            GPay: <CreditCard className="w-4 h-4" />,
            Cash: <Wallet className="w-4 h-4" />,
            "Mess Bill": <ReceiptText className="w-4 h-4" />,
          };

          return (
            <Button
              key={method}
              onClick={() => setPaymentMethod(method)}
              variant={paymentMethod === method ? "default" : "outline"}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {icons[method]}
              {method === "Mess Bill" ? "Mess Bill" : `Pay with ${method}`}
            </Button>
          );
        })}
      </div>

      {/* Update Button */}
      <div className="mt-4">
        <Button
          onClick={() => handleUpdate(paymentMethod, userId)} // Pass method and userId
          disabled={loading || !paymentMethod || !userInfo.name || !userInfo.phone || selectedShows.length === 0}
          className="flex items-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              ></path>
            </svg>
          ) : (
            isEditMode ? "Update" : "Book"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TicketBookingUpdateForm;

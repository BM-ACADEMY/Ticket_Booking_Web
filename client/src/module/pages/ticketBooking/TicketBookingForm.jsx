import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IndianRupee, Wallet, User, Mail, Phone, StickyNote, CreditCard, ReceiptText } from "lucide-react";
import { useAuth } from "@/module/context/AuthContext";
import { toast } from "react-toastify";

const TicketBookingForm = ({ shows }) => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        notes: "",
    });
    const { user } = useAuth();
    const [selectedShows, setSelectedShows] = useState([]);
    const [allShows, setAllShows] = useState([]);
    const [loadingShows, setLoadingShows] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);


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

    const handleTicketChange = (id, count) => {
        setSelectedShows((prev) =>
            prev.map((s) => (s._id === id ? { ...s, ticket_count: count } : s))
        );
    };

    const calculateAmount = (price, count) => Number(price) * Number(count);

    const totalAmount = selectedShows.reduce(
        (acc, s) => acc + calculateAmount(s.price, s.ticket_count),
        0
    );

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`);
                setAllShows(res.data.data);
                // toast.success("Shows fetched successfully!");
            } catch (err) {
                // toast.error("Failed to fetch shows.");
                console.error(err);
            } finally {
                setLoadingShows(false);
            }
        };

        fetchShows();
    }, []);

    const handleTicketCountChange = (showId, newCount) => {
        setSelectedShows((prev) =>
            prev.map((s) =>
                s._id === showId
                    ? {
                        ...s,
                        ticket_count:
                            newCount === "" ? "" : Number(newCount),
                    }
                    : s
            )
        );
    };


    const handleSubmit = async (method) => {
        if (!userInfo.name || !userInfo.phone || selectedShows.length === 0 || !method) {
            toast.error("Please fill all required fields, select at least one show, and choose a payment method.");
            return;
        }

        setLoading(true);

        try {
            const userResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/create-user`,
                userInfo
            );

            const userId = userResponse.data.data._id;

            const ticketPayload = selectedShows.map((s) => ({
                user_id: userId,
                show_id: s._id,
                ticket_count: s.ticket_count,
                created_by: user?._id || "default-admin-id",
                amount: calculateAmount(s.price, s.ticket_count),
                payment_method: method,
            }));

            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/tickets/create-ticket`,
                ticketPayload
            );

            toast.success("Tickets booked successfully!");
            // ✅ Reset form after success
            setUserInfo({ name: "", phone: "", notes: "" });
            setSelectedShows([]);
            setPaymentMethod("");
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
                style={{ backgroundColor: "#030049" }}>
                🎟️ Book Tickets
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
                        required
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
                        placeholder="Enter your phone number"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="notes" className="mb-3 flex items-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        Notes
                    </Label>
                    <Textarea
                        id="notes"
                        placeholder="Any special requests or notes"
                        name="notes"
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
                                        <Label htmlFor={`show-${show._id}`} className="flex items-center gap-3 text-base font-medium">
                                            <Checkbox
                                                id={`show-${show._id}`}
                                                className="cursor-pointer"
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleShowSelect(show, checked)}
                                            />
                                            {show.title} — ₹{show.price}
                                            {isSelected && show.qr_code_link && (
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {show.qr_code_link.length > 10 ? `${show.qr_code_link.slice(0, 10)}...` : show.qr_code_link}
                                                </span>
                                            )}
                                        </Label>
                                    </div>

                                    {isSelected && (
                                        <div className="flex flex-col">
                                            <Label htmlFor={`ticket-count-${show._id}`} className="text-sm font-medium mb-1">
                                                Ticket Count
                                            </Label>
                                            <Input
                                                id={`ticket-count-${show._id}`}
                                                type="text"
                                                value={selectedShow?.ticket_count === 0 ? "" : selectedShow?.ticket_count}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^\d*$/.test(val)) {
                                                        handleTicketCountChange(show._id, val);
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

            {/* Total Amount */}
            <div className="text-xl font-bold flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Total: ₹{totalAmount}
            </div>

            {/* Payment Method Selection */}
            <div className="flex gap-4 flex-wrap">
                <Button
                    onClick={() => setPaymentMethod("GPay")}
                    variant={paymentMethod === "GPay" ? "default" : "outline"}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <CreditCard className="w-4 h-4" />
                    Pay with GPay
                </Button>
                <Button
                    onClick={() => setPaymentMethod("Cash")}
                    variant={paymentMethod === "Cash" ? "default" : "outline"}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Wallet className="w-4 h-4" />
                    Cash Payment
                </Button>
                <Button
                    onClick={() => setPaymentMethod("Mess Bill")}
                    variant={paymentMethod === "Mess Bill" ? "default" : "outline"}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <ReceiptText className="w-4 h-4" />
                    Mess Bill
                </Button>
            </div>

            {/* Submit Button */}
            <Button
                onClick={() => handleSubmit(paymentMethod)}
                variant="default"
                className="w-full mt-4 flex items-center justify-center gap-2"
                disabled={!paymentMethod || loading}
            >
                {loading && (
                    <svg
                        className="animate-spin h-5 w-5 text-white"
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
                            d="M4 12a8 8 0 018-8v8z"
                        ></path>
                    </svg>
                )}
                {loading ? "Processing..." : "Submit"}
            </Button>

        </div>
    );
}

export default TicketBookingForm;




// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   IndianRupee,
//   Wallet,
//   User,
//   Phone,
//   StickyNote,
//   CreditCard,
//   ReceiptText,
// } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@/module/context/AuthContext";
// import { toast } from "react-toastify";

// const TicketBookingForm = () => {
//   const [userInfo, setUserInfo] = useState({ name: "", phone: "", notes: "" });
//   const { user } = useAuth();
//   const [selectedShows, setSelectedShows] = useState([]);
//   const [allShows, setAllShows] = useState([]);
//   const [loadingShows, setLoadingShows] = useState(true);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isCombo, setIsCombo] = useState(false);

//   useEffect(() => {
//     const fetchShows = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`);
//         setAllShows(res.data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingShows(false);
//       }
//     };
//     fetchShows();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleShowSelect = (show) => {
//     setSelectedShows((prev) => {
//       const exists = prev.find((s) => s._id === show._id);
//       if (exists) {
//         return prev.filter((s) => s._id !== show._id);
//       } else {
//         return [...prev, { ...show, ticket_count: 1 }];
//       }
//     });
//   };

//   const handleTicketCountChange = (showId, newCount) => {
//     if (isCombo) {
//       setSelectedShows((prev) =>
//         prev.map((s) => ({ ...s, ticket_count: newCount === "" ? "" : Number(newCount) }))
//       );
//     } else {
//       setSelectedShows((prev) =>
//         prev.map((s) =>
//           s._id === showId
//             ? { ...s, ticket_count: newCount === "" ? "" : Number(newCount) }
//             : s
//         )
//       );
//     }
//   };

//   const calculateAmount = (price, count) => Number(price) * Number(count);

//   const baseAmount = selectedShows.reduce(
//     (acc, s) => acc + calculateAmount(s.price, s.ticket_count),
//     0
//   );

//   const totalAmount = isCombo ? Math.max(baseAmount - 200, 0) : baseAmount;

//   const handleSubmit = async (method) => {
//     if (!userInfo.name || !userInfo.phone || selectedShows.length === 0 || !method) {
//       toast.error("Please fill all required fields, select at least one show, and choose a payment method.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const userResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/create-user`, userInfo);
//       const userId = userResponse.data.data._id;

//       const ticketPayload = isCombo
//         ? [
//             {
//               user_id: userId,
//               show_id: selectedShows.map((s) => s._id),
//               ticket_count: selectedShows[0].ticket_count,
//               created_by: user?._id || "default-admin-id",
//               amount: totalAmount,
//               payment_method: method,
//               is_combo: true,
//             },
//           ]
//         : selectedShows.map((s) => ({
//             user_id: userId,
//             show_id: s._id,
//             ticket_count: s.ticket_count,
//             created_by: user?._id || "default-admin-id",
//             amount: calculateAmount(s.price, s.ticket_count),
//             payment_method: method,
//             is_combo: false,
//           }));

//       await axios.post(`${import.meta.env.VITE_BASE_URL}/tickets/create-ticket`, ticketPayload);

//       toast.success("Tickets booked successfully!");
//       setUserInfo({ name: "", phone: "", notes: "" });
//       setSelectedShows([]);
//       setPaymentMethod("");
//       setIsCombo(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm" style={{ backgroundColor: "#030049" }}>
//         🎟️ Book Tickets
//       </h2>

//       {/* User Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Label htmlFor="name" className="mb-3 flex items-center gap-2">
//             <User className="w-4 h-4" />
//             Name
//           </Label>
//           <Input id="name" name="name" value={userInfo.name} placeholder="Enter your name" onChange={handleInputChange} required />
//         </div>
//         <div>
//           <Label htmlFor="phone" className="mb-3 flex items-center gap-2">
//             <Phone className="w-4 h-4" />
//             Phone
//           </Label>
//           <Input id="phone" name="phone" value={userInfo.phone} placeholder="Enter your phone number" onChange={handleInputChange} required />
//         </div>
//         <div className="md:col-span-2">
//           <Label htmlFor="notes" className="mb-3 flex items-center gap-2">
//             <StickyNote className="w-4 h-4" />
//             Notes
//           </Label>
//           <Textarea id="notes" name="notes" value={userInfo.notes} placeholder="Any special requests or notes" onChange={handleInputChange} />
//         </div>
//       </div>

//       {/* Combo Ticket Toggle */}
//       <div className="flex items-center gap-2 mb-4">
//         <Checkbox
//           id="combo-ticket"
//           checked={isCombo}
//           onCheckedChange={(checked) => {
//             setIsCombo(checked);
//             if (checked) {
//               const comboShows = allShows.map((show) => ({ ...show, ticket_count: 1 }));
//               setSelectedShows(comboShows);
//             } else {
//               setSelectedShows([]);
//             }
//           }}
//         />
//         <Label htmlFor="combo-ticket" className="font-medium">🎁 Combo Ticket (Get ₹200 off)</Label>
//       </div>

//       {/* Show Selection */}
//       <div>
//         <Label className="text-lg font-semibold mb-3 block">Select Shows</Label>
//         {loadingShows ? (
//           <p>Loading shows...</p>
//         ) : (
//           allShows.map((show) => {
//             const isSelected = selectedShows.some((s) => s._id === show._id);
//             const selectedShow = selectedShows.find((s) => s._id === show._id);

//             return (
//               <Card key={show._id} className="mb-4">
//                 <CardContent className="space-y-3 py-4">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor={`show-${show._id}`} className="flex items-center gap-3 text-base font-medium">
//                       <Checkbox
//                         id={`show-${show._id}`}
//                         className="cursor-pointer"
//                         checked={isSelected}
//                         disabled={isCombo}
//                         onCheckedChange={() => handleShowSelect(show)}
//                       />
//                       {show.title} — ₹{show.price}
//                     </Label>
//                   </div>
//                   {isSelected && (
//                     <div className="flex flex-col">
//                       <Label htmlFor={`ticket-count-${show._id}`} className="text-sm font-medium mb-1">
//                         Ticket Count
//                       </Label>
//                       <Input
//                         id={`ticket-count-${show._id}`}
//                         type="text"
//                         value={selectedShow?.ticket_count === 0 ? "" : selectedShow?.ticket_count}
//                         onChange={(e) => {
//                           const val = e.target.value;
//                           if (/^\d*$/.test(val)) {
//                             handleTicketCountChange(show._id, val);
//                           }
//                         }}
//                         className="w-32"
//                       />
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })
//         )}
//       </div>

//       {/* Total Amount */}
//       <div className="text-xl font-bold flex items-center gap-2">
//         <IndianRupee className="w-5 h-5" />
//         Total: ₹{totalAmount}
//       </div>

//       {/* Payment Methods */}
//       <div className="flex gap-4 flex-wrap">
//         <Button onClick={() => setPaymentMethod("GPay")} variant={paymentMethod === "GPay" ? "default" : "outline"} className="flex items-center gap-2">
//           <CreditCard className="w-4 h-4" />
//           Pay with GPay
//         </Button>
//         <Button onClick={() => setPaymentMethod("Cash")} variant={paymentMethod === "Cash" ? "default" : "outline"} className="flex items-center gap-2">
//           <Wallet className="w-4 h-4" />
//           Cash Payment
//         </Button>
//         <Button onClick={() => setPaymentMethod("Mess Bill")} variant={paymentMethod === "Mess Bill" ? "default" : "outline"} className="flex items-center gap-2">
//           <ReceiptText className="w-4 h-4" />
//           Mess Bill
//         </Button>
//       </div>

//       {/* Submit */}
//       <Button onClick={() => handleSubmit(paymentMethod)} className="w-full mt-4" disabled={!paymentMethod || loading}>
//         {loading ? "Processing..." : "Submit"}
//       </Button>
//     </div>
//   );
// };

// export default TicketBookingForm;

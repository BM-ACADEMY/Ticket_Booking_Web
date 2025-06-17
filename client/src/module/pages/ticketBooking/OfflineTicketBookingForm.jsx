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
// import { toast } from "react-toastify";

// const OfflineTicketBookingForm = ({ shows }) => {
//     const [userInfo, setUserInfo] = useState({
//         name: "",
//         phone: "",
//         notes: "",
//     });
//     const {user} =useAuth();
//     const [selectedShows, setSelectedShows] = useState([]);
//     const [allShows, setAllShows] = useState([]);
//     const [loadingShows, setLoadingShows] = useState(true);

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
//                 // toast.success("Shows fetched successfully!");
//             } catch (err) {
//                 // toast.error("Failed to fetch shows.");

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

//         console.log(method,'method');

//         if (!userInfo.name || !userInfo.phone || selectedShows.length === 0) {
//             toast.error("Please fill all required fields and select at least one show.");
//             return;
//         }

//         try {
//             // Step 1: Create user
//             const userResponse = await axios.post(
//                 `${import.meta.env.VITE_BASE_URL}/users/create-user`,
//                 userInfo
//             );

//             const userId = userResponse.data.data._id;

//             // Step 2: Prepare ticket data
//             const ticketPayload = selectedShows.map((s) => ({
//                 user_id: userId,
//                 show_id: s._id,
//                 ticket_count: s.ticket_count,
//                 created_by: user?._id || "default-admin-id", // Replace with actual admin ID if needed
//                 amount: calculateAmount(s.price, s.ticket_count),
//                 payment_method: method,
//             }));

//             // Step 3: Book tickets
//             const ticketResponse = await axios.post(
//                 `${import.meta.env.VITE_BASE_URL}/tickets/create-ticket`,
//                 ticketPayload
//             );

//             toast.success("Tickets booked successfully!");
//         } catch (err) {
//             const errorMessage =
//                 err.response?.data?.message || err.message || "Something went wrong";
//             toast.error(errorMessage);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto space-y-6">
//             <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
//         style={{ backgroundColor: "#030049" }}>🎟️ Book Tickets</h2>

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
//                                                 type="number"
//                                                 min={1}
//                                                 value={selectedShow?.ticket_count || 1}
//                                                 onChange={(e) =>
//                                                     handleTicketCountChange(show._id, parseInt(e.target.value, 10))
//                                                 }
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

// export default OfflineTicketBookingForm;


// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { IndianRupee, Wallet, User, Phone, StickyNote, CreditCard, ReceiptText } from "lucide-react";
// import { useAuth } from "@/module/context/AuthContext";
// import { toast } from "react-toastify";

// const OfflineTicketBookingForm = ({ shows }) => {
//     const [userInfo, setUserInfo] = useState({
//         name: "",
//         phone: "",
//         notes: "",
//     });
//     const { user } = useAuth();
//     const [selectedShows, setSelectedShows] = useState([]);
//     const [allShows, setAllShows] = useState([]);
//     const [loadingShows, setLoadingShows] = useState(true);
//     const [loading, setLoading] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserInfo((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleShowSelect = (show) => {
//         setSelectedShows((prev) => {
//             const exists = prev.find((s) => s._id === show._id);
//             if (exists) {
//                 return prev.filter((s) => s._id !== show._id);
//             } else {
//                 return [...prev, { ...show, ticket_count: 1 }];
//             }
//         });
//     };

//     const handleTicketCountChange = (showId, newCount) => {
//         if (newCount === "" || /^\d+$/.test(newCount)) {
//             setSelectedShows((prev) =>
//                 prev.map((s) =>
//                     s._id === showId
//                         ? { ...s, ticket_count: newCount === "" ? "" : Number(newCount) }
//                         : s
//                 )
//             );
//         }
//     };

//     const calculateAmount = (price, count) => Number(price) * Number(count);

//     const totalAmount = selectedShows.reduce(
//         (acc, s) => acc + calculateAmount(s.price, s.ticket_count || 0),
//         0
//     );

//     useEffect(() => {
//         const fetchShows = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`);
//                 setAllShows(res.data.data);
//                 // toast.success("Shows fetched successfully!");
//             } catch (err) {
//                 // toast.error("Failed to fetch shows.");
//                 console.error(err);
//             } finally {
//                 setLoadingShows(false);
//             }
//         };

//         fetchShows();
//     }, []);

//     const handleSubmit = async (method) => {
//         if (!userInfo.name || !userInfo.phone || selectedShows.length === 0) {
//             toast.error("Please fill all required fields and select at least one show.");
//             return;
//         }

//         // Validate ticket counts
//         const invalidTicketCount = selectedShows.some(
//             (s) => !s.ticket_count || s.ticket_count < 1
//         );
//         if (invalidTicketCount) {
//             toast.error("Please enter a valid ticket count for all selected shows.");
//             return;
//         }

//         setLoading(true);

//         try {
//             // Step 1: Create user
//             const userResponse = await axios.post(
//                 `${import.meta.env.VITE_BASE_URL}/users/create-user`,
//                 userInfo
//             );

//             const userId = userResponse.data.data._id;

//             // Step 2: Prepare ticket data
//             const ticketPayload = selectedShows.map((s) => ({
//                 user_id: userId,
//                 show_id: s._id,
//                 ticket_count: s.ticket_count,
//                 created_by: user?._id || "default-admin-id",
//                 amount: calculateAmount(s.price, s.ticket_count),
//                 payment_method: method,
//             }));

//             // Step 3: Book tickets
//             await axios.post(
//                 `${import.meta.env.VITE_BASE_URL}/tickets/create-ticket`,
//                 ticketPayload
//             );

//             toast.success("Tickets booked successfully!");
//             // Reset form after success
//             setUserInfo({ name: "", phone: "", notes: "" });
//             setSelectedShows([]);
//         } catch (err) {
//             const errorMessage =
//                 err.response?.data?.message || err.message || "Something went wrong";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto space-y-6">
//             <h2
//                 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
//                 style={{ backgroundColor: "#030049" }}
//             >
//                 🎟️ Book Tickets
//             </h2>

//             {/* User Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <Label htmlFor="name" className="mb-3 flex items-center gap-2">
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
//                     <Label htmlFor="phone" className="mb-3 flex items-center gap-2">
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
//                     <Label htmlFor="notes" className="mb-3 flex items-center gap-2">
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
//                                         <Label
//                                             htmlFor={`show-${show._id}`}
//                                             className="flex items-center gap-3 text-base font-medium"
//                                         >
//                                             <Checkbox
//                                                 id={`show-${show._id}`}
//                                                 className="cursor-pointer"
//                                                 checked={isSelected}
//                                                 onCheckedChange={() => handleShowSelect(show)}
//                                             />
//                                             {show.title} — ₹{show.price}
//                                         </Label>
//                                     </div>

//                                     {isSelected && (
//                                         <div className="flex flex-col">
//                                             <Label
//                                                 htmlFor={`ticket-count-${show._id}`}
//                                                 className="text-sm font-medium mb-1"
//                                             >
//                                                 Ticket Count
//                                             </Label>
//                                             <Input
//                                                 id={`ticket-count-${show._id}`}
//                                                 type="text"
//                                                 value={selectedShow?.ticket_count || ""}
//                                                 onChange={(e) =>
//                                                     handleTicketCountChange(show._id, e.target.value)
//                                                 }
//                                                 className="w-32"
//                                                 placeholder="Enter ticket count"
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
//                 <Button
//                     onClick={() => handleSubmit("GPay")}
//                     variant="default"
//                     className="flex items-center gap-2 cursor-pointer"
//                     disabled={loading}
//                 >
//                     {loading && (
//                         <svg
//                             className="animate-spin h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                         >
//                             <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                             ></circle>
//                             <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8z"
//                             ></path>
//                         </svg>
//                     )}
//                     {loading ? "Processing..." : "Pay with GPay"}
//                     <CreditCard className="w-4 h-4" />
//                 </Button>
//                 <Button
//                     onClick={() => handleSubmit("Cash")}
//                     variant="outline"
//                     className="flex items-center gap-2 cursor-pointer"
//                     disabled={loading}
//                 >
//                     {loading && (
//                         <svg
//                             className="animate-spin h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                         >
//                             <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                             ></circle>
//                             <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8z"
//                             ></path>
//                         </svg>
//                     )}
//                     {loading ? "Processing..." : "Cash Payment"}
//                     <Wallet className="w-4 h-4" />
//                 </Button>
//                 <Button
//                     onClick={() => handleSubmit("Mess Bill")}
//                     variant="secondary"
//                     className="flex items-center gap-2 cursor-pointer"
//                     disabled={loading}
//                 >
//                     {loading && (
//                         <svg
//                             className="animate-spin h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                         >
//                             <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                             ></circle>
//                             <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8z"
//                             ></path>
//                         </svg>
//                     )}
//                     {loading ? "Processing..." : "Mess Bill"}
//                     <ReceiptText className="w-4 h-4" />
//                 </Button>
//             </div>

//             {/* Submit Button */}
//             <Button
//                 onClick={() => handleSubmit("Provisional")}
//                 variant="default"
//                 className="w-full mt-4 flex items-center justify-center gap-2"
//                 disabled={loading}
//             >
//                 {loading && (
//                     <svg
//                         className="animate-spin h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                     >
//                         <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                         ></circle>
//                         <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v8z"
//                         ></path>
//                     </svg>
//                 )}
//                 {loading ? "Processing..." : "Provisional"}
//             </Button>
//         </div>
//     );
// };

// export default OfflineTicketBookingForm;
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IndianRupee, User, Phone, StickyNote, ScanLine, Copy, Check, ExternalLink } from "lucide-react";
import { useAuth } from "@/module/context/AuthContext";
import { toast } from "react-toastify";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const QrScanner = ({ onScanSuccess, onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const scannerRef = useRef(null);
  const qrReaderRef = useRef(null);
  const {user}=useAuth();

  const startScanner = () => {
    setCameraStarted(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
      setCameraStarted(false);
      setShowDialog(false);
    }
  };

  useEffect(() => {
    if (!cameraStarted || !qrReaderRef.current) return;

    const checkElement = setInterval(() => {
      if (document.getElementById("qr-reader")) {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: 250,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          },
          false
        );

        scannerRef.current = html5QrcodeScanner;

        const handleScanSuccess = (decodedText) => {
          setScanResult(decodedText);
          setShowDialog(true);
          onScanSuccess(decodedText);
          stopScanner();
        };

        const onScanFailure = (error) => {
          console.warn(`QR scan error: ${error}`);
        };

        html5QrcodeScanner.render(handleScanSuccess, onScanFailure);
        clearInterval(checkElement);
      }
    }, 100);

    return () => {
      clearInterval(checkElement);
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };
  }, [cameraStarted, onScanSuccess]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const openInNewTab = () => {
    if (scanResult) {
      window.open(scanResult, "_blank");
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>QR Code Scanner</DialogTitle>
      </DialogHeader>
      {!cameraStarted ? (
        <div className="text-center">
          <ScanLine className="mx-auto mb-4 w-16 h-16 text-black" />
          <Button onClick={startScanner}>Start Scanner</Button>
        </div>
      ) : (
        <>
          <div id="qr-reader" ref={qrReaderRef} className="w-full mx-auto mb-4" />
          <Button onClick={stopScanner}>Stop Scanner</Button>
        </>
      )}
      {showDialog && scanResult && (
        <>
          <p className="text-gray-700 whitespace-pre-wrap break-all">{scanResult}</p>
          <DialogFooter className="flex gap-2 justify-end items-center">
            <Button
              variant="outline"
              onClick={openInNewTab}
              className="hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

const OfflineTicketBookingForm = ({ shows }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [userId, setUserId] = useState(null);
  const [existingTickets, setExistingTickets] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("GPay");
  const { user } = useAuth();
  const [selectedShows, setSelectedShows] = useState([]);
  const [allShows, setAllShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowSelect = (show) => {
    setSelectedShows((prev) => {
      const exists = prev.find((s) => s._id === show._id);
      const newShows = exists
        ? prev.filter((s) => s._id !== show._id)
        : [...prev, { _id: show._id, title: show.title, price: show.price, ticket_count: 1 }];
      console.log("Updated selectedShows:", newShows);
      return newShows;
    });
  };

  const handleTicketCountChange = (showId, newCount) => {
    if (newCount === "" || /^\d+$/.test(newCount)) {
      setSelectedShows((prev) => {
        const updatedShows = prev.map((s) =>
          s._id === showId
            ? { ...s, ticket_count: newCount === "" ? "" : Number(newCount) }
            : s
        );
        console.log("Updated selectedShows after ticket count change:", updatedShows);
        return updatedShows;
      });
    }
  };

  const calculateAmount = (price, count) => Number(price) * Number(count);

  const totalAmount = selectedShows.reduce(
    (acc, s) => acc + calculateAmount(s.price, s.ticket_count || 0),
    0
  );

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/shows/fetch-all-shows`);
        console.log("Fetched shows:", res.data.data);
        setAllShows(res.data.data);
      } catch (err) {
        console.error("Fetch shows error:", err);
        toast.error("Failed to fetch shows.");
      } finally {
        setLoadingShows(false);
      }
    };
    fetchShows();
  }, []);

  const handleScanSuccess = async (scannedId) => {
    try {
      if (loadingShows) {
        toast.error("Shows are still loading. Please wait.");
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/by-qrcode/${scannedId}`);
      const userData = response.data.data;
   
      console.log(userData,"userdat");
      
      if (userData && userData._id) {
        setUserId(userData._id);
        setUserInfo({
          name: userData.name || "",
          phone: userData.phone || "",
          notes: userData.notes || "",
        });

        if (userData.shows && userData.shows.length > 0) {
          const newShows = userData.shows
            .filter((ticket) => {
              const showExists = allShows.find(
                (s) => s._id.toString() === ticket.show_id.toString()
              );
              return showExists;
            })
            .map((ticket) => {
              const show = allShows.find(
                (s) => s._id.toString() === ticket.show_id.toString()
              );
              return {
                _id: ticket.show_id,
                title: ticket.show_title || show?.title,
                price: show ? show.price : ticket.amount / ticket.ticket_count,
                ticket_count: ticket.ticket_count,
              };
            });

          setSelectedShows((prev) => {
            const updatedShows = [
              ...prev.filter((s) => !newShows.some((ns) => ns._id === s._id)),
              ...newShows,
            ];
            console.log("SelectedShows after QR scan:", updatedShows);
            return updatedShows;
          });
          setExistingTickets(userData.shows);
          toast.success(
            `Loaded ${newShows.length} show(s) for ${userData.name} from QR scan!`
          );
        } else {
          setExistingTickets([]);
          toast.info(
            `User ${userData.name} has no tickets. Form prefilled with user details.`
          );
        }
      } else {
        toast.error("No user found with the scanned QR code.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch user details.";
      toast.error(errorMessage);
    } finally {
      setShowScanner(false);
    }
  };

  // const handleUpdate = async (method, userId) => {
  //   if (!userInfo.name || !userInfo.phone || selectedShows.length === 0 || !method) {
  //     toast.error("Please fill all required fields, select at least one show, and choose a payment method.");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     // Sanitize selectedShows to ensure no circular references
  //     const sanitizedShows = selectedShows.map((s) => ({
  //       _id: s._id,
  //       ticket_count: s.ticket_count,
  //       price: s.price,
  //     }));

  //     // Prepare payload for user and tickets
  //     const updatePayload = {
  //       userInfo: { ...userInfo }, // name, phone, notes
  //       tickets: sanitizedShows.map((s) => ({
  //         show_id: s._id,
  //         ticket_count: s.ticket_count,
  //         amount: calculateAmount(s.price, s.ticket_count),
  //         payment_method: method,
  //         created_by: user._id,
  //       })),
  //     };

  //     // Call the update API
  //     const response = await axios.put(
  //       `${import.meta.env.VITE_BASE_URL}/users/update-user/${userId}`,
  //       updatePayload
  //     );

  //     toast.success("User and tickets updated successfully!");
  //     // Reset form after success
  //     setUserInfo({ name: "", phone: "", notes: "" });
  //     setSelectedShows([]);
  //     setPaymentMethod("");
  //     setUserId(null);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || err.message || "Something went wrong";
  //     console.error("Update error:", errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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

    console.log("Sending update request with userId:", userId);
    console.log("Update payload:", updatePayload);

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
  console.log("Render selectedShows:", selectedShows);

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <Button
        onClick={() => setShowScanner(true)}
        variant="outline"
        className="absolute top-0 right-0 flex items-center gap-2"
      >
        <ScanLine className="w-4 h-4" />
        Scan QR
      </Button>

      <h2
        className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}
      >
        🎟️ Update Tickets
      </h2>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <QrScanner onScanSuccess={handleScanSuccess} onClose={() => setShowScanner(false)} />
      </Dialog>

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

      <div>
        <Label className="text-lg font-semibold mb-3 block">Select Shows</Label>
        {loadingShows ? (
          <p>Loading shows...</p>
        ) : allShows.length === 0 ? (
          <p>No shows available.</p>
        ) : (
          allShows.map((show) => {
            const isSelected = selectedShows.some((s) => s._id === show._id);
            const selectedShow = selectedShows.find((s) => s._id === show._id);

            return (
              <Card key={show._id} className="mb-4">
                <CardContent className="space-y-3 py-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`show-${show._id}`}
                      className="flex items-center gap-3 text-base font-medium"
                    >
                      <Checkbox
                        id={`show-${show._id}`}
                        className="cursor-pointer"
                        checked={isSelected}
                        onCheckedChange={() => handleShowSelect(show)}
                      />
                      {show.title} — ₹{show.price}
                    </Label>
                  </div>

                  {isSelected && (
                    <div className="flex flex-col">
                      <Label
                        htmlFor={`ticket-count-${show._id}`}
                        className="text-sm font-medium mb-1"
                      >
                        Ticket Count
                      </Label>
                      <Input
                        id={`ticket-count-${show._id}`}
                        type="text"
                        value={selectedShow?.ticket_count || ""}
                        onChange={(e) =>
                          handleTicketCountChange(show._id, e.target.value)
                        }
                        className="w-32"
                        placeholder="Enter ticket count"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div>
        <Label className="text-lg font-semibold mb-3 block">Payment Method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="GPay" id="gpay" />
            <Label htmlFor="gpay">GPay</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Cash" id="cash" />
            <Label htmlFor="cash">Cash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Mess Bill" id="mess-bill" />
            <Label htmlFor="mess-bill">Mess Bill</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Provisional" id="provisional-radio" />
            <Label htmlFor="provisional-radio">Provisional</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="text-xl font-bold flex items-center gap-2">
        <IndianRupee className="w-5 h-5" />
        Total: ₹{totalAmount.toFixed(2)}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button
          onClick={() => handleUpdate(paymentMethod, userId)} // Pass paymentMethod and userId explicitly
          variant="default"
          className="flex items-center gap-2 cursor-pointer"
          disabled={loading || !userId || selectedShows.length === 0}
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
                d="evenodd"
              ></path>
            </svg>
          )}
          {loading ? "Processing..." : "Update Tickets"}
        </Button>
      </div>
    </div>
  );
};

export default OfflineTicketBookingForm;


import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CalendarIcon, ImageIcon, MapPin, Tag, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Calendar24 from "@/components/ui/calendar24"; // Your provided date/time picker
import axios from "axios";
const Events=()=> {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    logo: null,
  });
  const [dateTime, setDateTime] = useState({ date: undefined, time: "10:30:00" });
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const router = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (e.g., PNG, JPEG).",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Validate inputs
  if (
    !formData.title ||
    !formData.location ||
    !formData.price ||
    !dateTime.date ||
    !dateTime.time
  ) {
    toast.error("Missing required fields", {
      description: "Please fill in all required fields.",
    });
    setIsLoading(false);
    return;
  }

  // Combine date and time into a single ISO string
  const date = new Date(dateTime.date); // ensure it's a new Date object
  const [hours, minutes, seconds] = dateTime.time.split(":");
  const fullDate = new Date(dateTime.date); // ensure it's a clean Date object

  fullDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
  const datetime = fullDate.toISOString(); // ✅ precise timestamp

  // Create FormData for file upload
  const formDataToSend = new FormData();
  formDataToSend.append("title", formData.title);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("datetime", datetime);
  formDataToSend.append("price", formData.price);
  if (formData.logo) {
    formDataToSend.append("logo", formData.logo);
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/shows/create-show`, // ✅ update this URL
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Optional if cookies/session are used
      }
    );

    // Reset form
    setFormData({ title: "", location: "", price: "", logo: null });
    setDateTime({ date: undefined, time: "10:30:00" });
    setLogoPreview(null);
    fileInputRef.current.value = null;
    // setTimeout(() => router("/shows"), 2000);
  } catch (error) {
    console.error("Show creation error:", error);
    const message =
      error.response?.data?.message || "Failed to create the show.";
  
  } finally {
    setIsLoading(false);
  }
};

return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <h2 className="text-2xl font-semibold text-foreground col-span-2">Create New Show</h2>

      {/* Left Column */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Text className="h-4 w-4" />
            Title
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter show title"
            required
            className="w-full"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter show location"
            required
            className="w-full"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Price
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter ticket price"
            required
            className="w-full"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Date and Time */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date and Time
          </Label>
          <Calendar24
            date={dateTime.date}
            setDate={(date) => setDateTime((prev) => ({ ...prev, date }))}
            time={dateTime.time}
            setTime={(time) => setDateTime((prev) => ({ ...prev, time }))}
          />
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <Label htmlFor="logo" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Logo
          </Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full"
          />
          {logoPreview && (
            <div className="mt-2">
              <img src={logoPreview} alt="Logo Preview" className="h-24 w-24 object-cover rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Show"}
        </Button>
      </div>
    </form>
  );
}
export default Events;
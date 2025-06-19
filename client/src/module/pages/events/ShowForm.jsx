import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CalendarIcon, ImageIcon, MapPin, Tag, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Calendar24 from "@/components/ui/calendar24";

export default function ShowForm({ initialData = null }) {


    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        location: initialData?.location || "",
        price: initialData?.price?.toString() || "",
        logo: null,
    });

    const [dateTime, setDateTime] = useState({
        date: initialData?.datetime ? new Date(initialData.datetime) : undefined,
        time: initialData?.datetime
            ? new Date(initialData.datetime).toTimeString().slice(0, 8)
            : "10:30:00",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(initialData?.logo || null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                location: initialData.location || "",
                price: initialData.price?.toString() || "",
                logo: null,
            });
            setDateTime({
                date: initialData.datetime ? new Date(initialData.datetime) : undefined,
                time: initialData.datetime
                    ? new Date(initialData.datetime).toTimeString().slice(0, 8)
                    : "10:30:00",
            });
            setLogoPreview(initialData.logo || null);
        }
    }, [initialData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFormData((prev) => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        } else {
            toast.error("Please upload a valid image file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.title || !formData.location || !formData.price || !dateTime.date || !dateTime.time) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        const date = new Date(dateTime.date);
        const [hours, minutes, seconds] = dateTime.time.split(":");
        date.setHours(hours, minutes, seconds);
        const datetime = date.toISOString();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("datetime", datetime);
        formDataToSend.append("price", formData.price);
        if (formData.logo) formDataToSend.append("logo", formData.logo);

        try {
            const url = initialData ? `${import.meta.env.VITE_BASE_URL}/shows/update-show/${initialData._id}` : `${import.meta.env.VITE_BASE_URL}/shows/create-show`;
            const method = initialData ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Show ${initialData ? "updated" : "created"} successfully`);
                // setTimeout(() => navigate("/shows"), 2000);
            } else {
                toast.error(data.message || "Something went wrong.");
            }
        } catch (err) {
            toast.error("Error while submitting the form.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            <h2 className="text-2xl font-semibold text-foreground col-span-2">
                {initialData ? "Edit Show" : "Create New Show"}
            </h2>

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
                    {isLoading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Show" : "Create Show")}
                </Button>
            </div>
        </form>
    );
}

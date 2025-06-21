import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import EventBrandFormDialog from "./EventBrandFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmationDialog";
import { toast } from "react-toastify"; // Assuming you're using react-hot-toast for toasts

const EventBrandList = () => {
    const [eventBrands, setEventBrands] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedEventBrand, setSelectedEventBrand] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchEventBrands = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/event-brand/fetch-all-event-brands`);
            setEventBrands(res.data.data);
            // toast.success(res.data.message || "Event sponsors fetched successfully");
        } catch (error) {
            console.error("Error fetching event brands:", error);
            // toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchEventBrands();
    }, []);

   const handleCreateOrUpdate = async (formData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // ✅ VERY IMPORTANT
        };

        let res;
        if (selectedEventBrand) {
            res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/event-brand/update-event-brand/${selectedEventBrand._id}`,
                formData,
                config
            );
            toast.success(res.data.message || "Event sponsor updated successfully");
        } else {
            res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/event-brand/create-event-brand`,
                formData,
                config
            );
            toast.success(res.data.message || "Event sponsor added successfully");
        }

        await fetchEventBrands(); // Refresh the list
    } catch (err) {
        console.error("Error saving event brand:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
        throw err;
    }
};


    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/event-brand/delete-event-brand/${deleteId}`);
            await fetchEventBrands();
            setDeleteOpen(false);
            setDeleteId(null);
            toast.success(res.data.message || "Event sponsor deleted successfully");
        } catch (err) {
            console.error("Error deleting event brand:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h2
                className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
                style={{ backgroundColor: "#030049" }}
            >
                Event Sponsor List
            </h2>
            <div className="flex justify-between items-center">
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 w-4 h-4" />Add Event Sponsor
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventBrands?.map((eventBrand) => (
                    <div key={eventBrand._id} className="p-4 border rounded-lg shadow space-y-2">
                        <img src={`${eventBrand.eventBrandLogo}`} alt={eventBrand.eventBrandName} className="w-20 h-20 object-contain" />
                        <p className="font-semibold">{eventBrand.eventBrandName}</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedEventBrand(eventBrand); setFormOpen(true); }}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => { setDeleteId(eventBrand._id); setDeleteOpen(true); }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <EventBrandFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedEventBrand(null);
                }}
                onSubmit={handleCreateOrUpdate}
                defaultValues={selectedEventBrand}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default EventBrandList;
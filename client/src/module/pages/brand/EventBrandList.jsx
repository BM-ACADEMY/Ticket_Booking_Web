import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import EventBrandFormDialog from "./EventBrandFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmationDialog";

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
            console.log(res, 'eventBrand');
        } catch (error) {
            console.log('Error fetching event brands');
        }
    };

    useEffect(() => {
        fetchEventBrands();
    }, []);

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (selectedEventBrand) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/event-brand/update-event-brand/${selectedEventBrand._id}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/event-brand/create-event-brand`, formData);
            }
            fetchEventBrands();
            setFormOpen(false);
            setSelectedEventBrand(null);
        } catch (err) {
            console.error("Error saving event brand:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/event-brand/delete-event-brand/${deleteId}`);
            fetchEventBrands();
            setDeleteOpen(false);
            setDeleteId(null);
        } catch (err) {
            console.error("Error deleting event brand:", err);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h2
                className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
                style={{ backgroundColor: "#030049" }}
            >
                Event Brand List
            </h2>
            <div className="flex justify-between items-center">
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 w-4 h-4" />Add Event Brand
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventBrands?.map((eventBrand) => (
                    <div key={eventBrand._id} className="p-4 border rounded-lg shadow space-y-2">
                        <img src={`${eventBrand.eventBrandLogo}`} alt={eventBrand.eventBrandName} className="w-20 h-20 object-cover" />
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
                onClose={() => { setFormOpen(false); setSelectedEventBrand(null); }}
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
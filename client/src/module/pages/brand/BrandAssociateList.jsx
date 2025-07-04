import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import BrandAssociateFormDialog from "./BrandAssociateFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmationDialog";
import { toast } from "react-toastify";

const BrandAssociateList = () => {
    const [brandAssociates, setBrandAssociates] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedBrandAssociate, setSelectedBrandAssociate] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchBrandAssociates = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/associate-brand/fetch-all-brand-associates`);
            setBrandAssociates(res.data.data);

            // toast.success(res.data.message || "Associate sponsors fetched successfully");
        } catch (error) {
            console.error('Error fetching brand associates:', error);
            // toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchBrandAssociates();
    }, []);
const handleCreateOrUpdate = async (formData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // ✅ Required for sending cookies/auth across domains
        };

        let res;
        if (selectedBrandAssociate) {
            res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/associate-brand/update-brand-associate/${selectedBrandAssociate._id}`,
                formData,
                config
            );
            toast.success(res.data.message || "Associate sponsor updated successfully");
        } else {
            res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/associate-brand/create-brand-associate`,
                formData,
                config
            );
            toast.success(res.data.message || "Associate sponsor added successfully");
        }

        await fetchBrandAssociates(); // Refresh the list
    } catch (err) {
        console.error("Error saving brand associate:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
        throw err;
    }
};


    const handleDelete = async () => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/associate-brand/delete-brand-associate/${deleteId}`
            );
            await fetchBrandAssociates();
            setDeleteOpen(false);
            setDeleteId(null);
            toast.success(res.data.message || "Associate sponsor deleted successfully");
        } catch (err) {
            console.error("Error deleting brand associate:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h2
                className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
                style={{ backgroundColor: "#030049" }}
            >
                Associate Sponsor List
            </h2>
            <div className="flex justify-between items-center">
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 w-4 h-4" />Add Associate Sponsor
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brandAssociates?.map((brandAssociate) => (
                    <div key={brandAssociate._id} className="p-4 border rounded-lg shadow space-y-2">
                        <img
                            src={`${brandAssociate.associateLogo}`}
                            alt={brandAssociate.associateName}
                            className="w-20 h-20 object-cover"
                        />
                        <p className="font-semibold">{brandAssociate.associateName}</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedBrandAssociate(brandAssociate);
                                    setFormOpen(true);
                                }}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setDeleteId(brandAssociate._id);
                                    setDeleteOpen(true);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <BrandAssociateFormDialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedBrandAssociate(null);
                }}
                onSubmit={handleCreateOrUpdate}
                defaultValues={selectedBrandAssociate}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default BrandAssociateList;
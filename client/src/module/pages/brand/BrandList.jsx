import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import BrandFormDialog from "./BrandFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmationDialog";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/brands/fetch-all-brands`);
            setBrands(res.data.data);
            console.log(res,'brand');
            
        } catch (error) {
            console.log('Error fetching brand')
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (selectedBrand) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/brands/update-brand/${selectedBrand._id}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/brands/create-brand`, formData);
            }
            fetchBrands();
            setFormOpen(false);
            setSelectedBrand(null);
        } catch (err) {
            console.error("Error saving brand:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/brands/delete-brand/${deleteId}`);
            fetchBrands();
            setDeleteOpen(false);
            setDeleteId(null);
        } catch (err) {
            console.error("Error deleting brand:", err);
        }
    };

    return (
        <div className="p-4 space-y-4">
                    <h2
      className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "royalblue" }}
    >
      Brand List
    </h2>
            <div className="flex justify-between items-center">
     
                <Button onClick={() => setFormOpen(true)}><Plus className="mr-2 w-4 h-4" />Add Brand</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brands?.map((brand) => (
                    <div key={brand._id} className="p-4 border rounded-lg shadow space-y-2">
                        <img src={`${brand.brandLogo}`} alt={brand.brandName} className="w-20 h-20 object-cover" />
                        <p className="font-semibold">{brand.brandName}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedBrand(brand); setFormOpen(true); }}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => { setDeleteId(brand._id); setDeleteOpen(true); }}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <BrandFormDialog
                open={formOpen}
                onClose={() => { setFormOpen(false); setSelectedBrand(null); }}
                onSubmit={handleCreateOrUpdate}
                defaultValues={selectedBrand}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default BrandList;

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const BrandFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const [brandName, setBrandName] = useState("");
    const [brandLogo, setBrandLogo] = useState(null); // File
    const [preview, setPreview] = useState("");

    // PATCH default values on edit
    useEffect(() => {
        if (defaultValues) {
            setBrandName(defaultValues.brandName || "");
            setPreview(defaultValues.brandLogo || "");
        } else {
            setBrandName("");
            setBrandLogo(null);
            setPreview("");
        }
    }, [defaultValues, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("brandName", brandName);
        if (brandLogo) {
            formData.append("brandLogo", brandLogo);
        }
        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setBrandLogo(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Edit Brand" : "Add Brand"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-3">Brand Name</Label>
                        <Input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Brand Logo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {preview && (
                            <img src={preview} alt="Preview" className="w-20 h-20 mt-2 object-cover rounded" />
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{defaultValues ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BrandFormDialog;

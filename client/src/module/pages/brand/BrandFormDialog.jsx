import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BrandFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const [brandName, setBrandName] = useState("");
    const [brandLogo, setBrandLogo] = useState(null);
    const [brandLink, setBrandLink] = useState("https://cms.com");
    const [preview, setPreview] = useState("");
    const isFormValid = brandName.trim() !== "" && brandLink.trim() !== "";

    useEffect(() => {
        if (open) {
            if (defaultValues) {
                setBrandName(defaultValues.brandName || "");
                setBrandLink(defaultValues.brandLink || "https://cms.com");
                setPreview(defaultValues.brandLogo || "");
                setBrandLogo(null); // Reset file input
            } else {
                resetForm();
            }
        } else {
            resetForm();
        }
    }, [defaultValues, open]);

    const resetForm = () => {
        if (preview) {
            URL.revokeObjectURL(preview); // Clean up object URL to prevent memory leaks
        }
        setBrandName("");
        setBrandLogo(null);
        setBrandLink("https://cms.com");
        setPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("brandName", brandName);
        formData.append("brandLink", brandLink);
        if (brandLogo) {
            formData.append("brandLogo", brandLogo);
        }
        try {
            await onSubmit(formData); // Wait for parent to complete
            resetForm(); // Reset form after successful submission
            onClose(); // Close the dialog
        } catch (err) {
            // Errors are handled in the parent via toast, keep dialog open for retry
        }
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
                        <Label className="mb-3">Title Sponsor Name</Label>
                        <Input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Title Sponsor Link</Label>
                        <Input
                            type="text"
                            value={brandLink}
                            onChange={(e) => setBrandLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Title Sponsor Logo</Label>
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
                        <Button type="button" variant="outline" onClick={() => { resetForm(); onClose(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            {defaultValues ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BrandFormDialog;
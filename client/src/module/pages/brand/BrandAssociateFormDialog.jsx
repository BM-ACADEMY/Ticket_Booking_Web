import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const BrandAssociateFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const [associateName, setAssociateName] = useState("");
    const [associateLogo, setAssociateLogo] = useState(null);
    const [associateLink, setAssociateLink] = useState("https://cms.com");
    const [preview, setPreview] = useState("");
    const isFormValid = associateName.trim() !== "" && associateLink.trim() !== "";

    // Reset form or populate with default values
    useEffect(() => {
        if (open) {
            if (defaultValues) {
                setAssociateName(defaultValues.associateName || "");
                setAssociateLink(defaultValues.associateLink || "https://cms.com");
                setPreview(defaultValues.associateLogo || "");
                setAssociateLogo(null); // Reset file input
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
        setAssociateName("");
        setAssociateLogo(null);
        setAssociateLink("https://cms.com");
        setPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("associateName", associateName);
        formData.append("associateLink", associateLink);
        if (associateLogo) {
            formData.append("associateLogo", associateLogo);
        }
        try {
            await onSubmit(formData); // Wait for parent logic to complete
            resetForm(); // Reset form after successful submission
            onClose(); // Close the dialog
        } catch (err) {
            // Errors are handled in the parent via toast, keep dialog open for retry
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAssociateLogo(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Edit Brand Associate" : "Add Brand Associate"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-3">Associate Name</Label>
                        <Input
                            type="text"
                            value={associateName}
                            onChange={(e) => setAssociateName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Associate Link</Label>
                        <Input
                            type="text"
                            value={associateLink}
                            onChange={(e) => setAssociateLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Associate Logo</Label>
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
                        <Button type="button" variant="outline" onClick={handleCancel}>
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

export default BrandAssociateFormDialog;
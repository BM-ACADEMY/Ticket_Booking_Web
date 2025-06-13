import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const BrandAssociateFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const [associateName, setAssociateName] = useState("");
    const [associateLogo, setAssociateLogo] = useState(null); // File
    const [preview, setPreview] = useState("");

    // PATCH default values on edit
    useEffect(() => {
        if (defaultValues) {
            setAssociateName(defaultValues.associateName || "");
            setPreview(defaultValues.associateLogo || "");
        } else {
            setAssociateName("");
            setAssociateLogo(null);
            setPreview("");
        }
    }, [defaultValues, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("associateName", associateName);
        if (associateLogo) {
            formData.append("associateLogo", associateLogo);
        }
        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAssociateLogo(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
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
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{defaultValues ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BrandAssociateFormDialog;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const EventBrandFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const [eventBrandName, setEventBrandName] = useState("");
    const [eventBrandLogo, setEventBrandLogo] = useState(null); // File
    const [preview, setPreview] = useState("");

    // PATCH default values on edit
    useEffect(() => {
        if (defaultValues) {
            setEventBrandName(defaultValues.eventBrandName || "");
            setPreview(defaultValues.eventBrandLogo || "");
        } else {
            setEventBrandName("");
            setEventBrandLogo(null);
            setPreview("");
        }
    }, [defaultValues, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("eventBrandName", eventBrandName);
        if (eventBrandLogo) {
            formData.append("eventBrandLogo", eventBrandLogo);
        }
        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEventBrandLogo(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Edit Event Brand" : "Add Event Brand"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-3">Event Brand Name</Label>
                        <Input
                            type="text"
                            value={eventBrandName}
                            onChange={(e) => setEventBrandName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Event Brand Logo</Label>
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

export default EventBrandFormDialog;
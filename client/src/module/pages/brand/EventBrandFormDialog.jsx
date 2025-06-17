import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EventBrandFormDialog = ({ open, onClose, onSubmit, defaultValues }) => {
    const DEFAULT_LINK = "https://cms.com";

    const [eventBrandName, setEventBrandName] = useState("");
    const [eventBrandLogo, setEventBrandLogo] = useState(null);
    const [eventBrandLink, setEventBrandLink] = useState(DEFAULT_LINK);
    const [preview, setPreview] = useState("");

    const isFormValid = eventBrandName.trim() !== "" && eventBrandLink.trim() !== "";

    useEffect(() => {
        if (open) {
            if (defaultValues) {
                setEventBrandName(defaultValues.eventBrandName || "");
                setEventBrandLink(defaultValues.eventBrandLink || DEFAULT_LINK);
                setPreview(defaultValues.eventBrandLogo || "");
                setEventBrandLogo(null);
            } else {
                resetForm();
            }
        } else {
            resetForm();
        }
    }, [defaultValues, open]);

    const resetForm = () => {
        setEventBrandName("");
        setEventBrandLogo(null);
        setEventBrandLink(DEFAULT_LINK);
        setPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("eventBrandName", eventBrandName);
        formData.append("eventBrandLink", eventBrandLink);
        if (eventBrandLogo) {
            formData.append("eventBrandLogo", eventBrandLogo);
        }
        try {
            await onSubmit(formData); // Wait for the submission to complete
            resetForm(); // Reset form after successful submission
            onClose(); // Close the dialog
        } catch (err) {
            // Errors are handled in the parent, no need to close here
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEventBrandLogo(file);
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
                    <DialogTitle>{defaultValues ? "Edit Event Brand" : "Add Event Brand"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-3">Event Sponsor Name</Label>
                        <Input
                            type="text"
                            value={eventBrandName}
                            onChange={(e) => setEventBrandName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Event Sponsor Link</Label>
                        <Input
                            type="text"
                            value={eventBrandLink}
                            onChange={(e) => setEventBrandLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-3">Event Sponsor Logo</Label>
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
                        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit" disabled={!isFormValid}>
                            {defaultValues ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};



export default EventBrandFormDialog;

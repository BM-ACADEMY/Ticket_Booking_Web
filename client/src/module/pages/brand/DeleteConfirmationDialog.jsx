import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this brand?</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteConfirmDialog;

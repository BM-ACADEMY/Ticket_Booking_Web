import { useEffect, useState } from "react";
import TicketBookingUpdateForm from "@/module/pages/ticketBooking/TicketBookingUpdateForm";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const TicketSheetWrapper  = ({ open, editData, onClose }) => {
  return (
    <Sheet open={open} onOpenChange={(val) => {
      if (!val) onClose();
    }}>
      <SheetContent side="right" className="w-[90vw] md:w-[600px] p-4 overflow-y-auto">
        {editData && (
          <TicketBookingUpdateForm
            editData={editData}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TicketSheetWrapper;
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnlineTicketBookingForm from "./TicketBookingForm";
import OfflineTicketBookingForm from "./OfflineTicketBookingForm";

const TicketBookingTabs = ({ shows }) => {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid  grid-cols-2">
          <TabsTrigger value="online">Online Booking</TabsTrigger>
          <TabsTrigger value="offline">Offline Booking</TabsTrigger>
        </TabsList>
        <TabsContent value="online">
          <OnlineTicketBookingForm shows={shows} />
        </TabsContent>
        <TabsContent value="offline">
          <OfflineTicketBookingForm shows={shows} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketBookingTabs;
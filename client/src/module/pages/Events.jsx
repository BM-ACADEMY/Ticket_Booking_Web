import { useState } from "react";
import EventListTable from "@/module/pages/events/ShowTableList";
import ShowForm from "@/module/pages/events/ShowForm";

const Events = () => {
  const [editShow, setEditShow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger refresh

  const handleEdit = (show) => {
    setEditShow(show);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Increment to trigger useEffect
    setEditShow(null); // Optional: clear form after update
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm" style={{ backgroundColor: "#030049" }}>
          Create / Edit Show
        </h2>
        <ShowForm initialData={editShow} onSuccess={handleRefresh} />
      </div>

      <div>
        <EventListTable onEdit={handleEdit} refresh={refreshKey} />
      </div>
    </div>
  );
};

export default Events;

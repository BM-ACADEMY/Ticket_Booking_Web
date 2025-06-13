import { useState } from "react";
import EventListTable from "@/module/pages/events/ShowTableList";
import ShowForm from "@/module/pages/events/ShowForm";

const Events = () => {
  const [editShow, setEditShow] = useState(null); // null for new, or object for edit

  const handleEdit = (show) => {
    setEditShow(show); // Send data to form to update
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Always visible form at the top */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm " style={{backgroundColor:"#030049"}}>Create / Edit Show</h2>
        <ShowForm initialData={editShow} />
      </div>

      {/* Always visible table list below */}
      <div>
        {/* <h2 className="text-xl font-semibold mb-4">Event List</h2> */}
        <EventListTable onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Events;

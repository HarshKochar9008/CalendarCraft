import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border px-4 py-2 rounded-full flex items-center shadow-md hover:shadow-3xl"
    >
      Add Event
    </button>
  );
}

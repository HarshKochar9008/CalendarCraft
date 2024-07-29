import React, { useState, useReducer } from "react";
import dayjs from "dayjs";

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: null,
  setDaySelected: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: () => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
  updateEventDate: () => {}, // Add this function
});

function eventsReducer(state, action) {
  switch (action.type) {
    case "ADD_EVENT":
      return [...state, action.payload];
    case "UPDATE_EVENT":
      return state.map(evt => evt.id === action.payload.id ? action.payload : evt);
    default:
      return state;
  }
}

export const GlobalProvider = ({ children }) => {
  const [monthIndex, setMonthIndex] = useState(0);
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(0);
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(eventsReducer, []);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const updateEventDate = (event, newDate) => {
    const updatedEvent = { ...event, day: newDate.toISOString() };
    dispatchCalEvent({ type: "UPDATE_EVENT", payload: updatedEvent });
  };

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
        setLabels,
        labels,
        updateLabel: () => {},
        filteredEvents,
        setFilteredEvents,
        updateEventDate, // Provide the updateEventDate function
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;

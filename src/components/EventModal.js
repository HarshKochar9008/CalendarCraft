import React, { useContext, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import GlobalContext from "../context/GlobalContext";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];
const STEP = 15;
const MIN = 0;
const MAX = 1440;

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );
  const [timeRange, setTimeRange] = useState(
    selectedEvent
      ? [selectedEvent.startTime, selectedEvent.endTime]
      : [540, 600]
  );

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h < 12 ? "AM" : "PM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${m < 10 ? "0" + m : m} ${period}`;
  };

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      startTime: timeRange[0],
      endTime: timeRange[1],
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-gray-50 rounded-lg shadow-2xl w-auto justify-between items-center">
        <header className="bg-blue-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-auto border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            <p>{daySelected.format("dddd, MMMM DD")}</p>
            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              bookmark_border
            </span>
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
            <span className="material-icons-outlined text-gray-400">
              access_time
            </span>
            <div className="flex flex-col">
              <Range
                values={timeRange}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(values) => setTimeRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "6px",
                      width: "100%",
                      background: getTrackBackground({
                        values: timeRange,
                        colors: ["#ccc", "#548BF4", "#ccc"],
                        min: MIN,
                        max: MAX,
                      }),
                      borderRadius: "3px",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "16px",
                      width: "16px",
                      backgroundColor: "#FFF",
                      border: "1px solid #ccc",
                      borderRadius: "50%",
                    }}
                  />
                )}
              />
              <div className="flex justify-between mt-2">
                <span>{formatTime(timeRange[0])}</span>
                <span>{formatTime(timeRange[1])}</span>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-100 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}

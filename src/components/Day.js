import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GlobalContext from '../context/GlobalContext';

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    updateEventDate, // Add this function to update the event date
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format('DD-MM-YY') === day.format('DD-MM-YY')
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : '';
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedEvent = dayEvents[source.index];

    if (source.droppableId !== destination.droppableId) {
      updateEventDate(draggedEvent, dayjs(destination.droppableId));
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={day.format('YYYY-MM-DD')}>
        {(provided) => (
          <div
            className='border border-gray-200 flex flex-col'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <header className='flex flex-col items-center'>
              {rowIdx === 0 && (
                <p className='text-sm mt-1'>
                  {day.format('ddd').toUpperCase()}
                </p>
              )}
              <p
                className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}
              >
                {day.format('DD')}
              </p>
            </header>
            <div
              className='flex-3 cursor-pointer'
              onClick={() => {
                setDaySelected(day);
                setShowEventModal(true);
              }}
            >
              {dayEvents.map((evt, idx) => (
                <Draggable key={evt.id} draggableId={evt.id} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-${evt.label}-200 p-1 mr-3 text-blue-600 text-sm rounded mb-1 truncate`}
                      onClick={() => setSelectedEvent(evt)}
                    >
                      {evt.title}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

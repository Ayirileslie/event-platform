import { useEffect, useState } from "react";
import { listAllEvents } from "../api/events";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    listAllEvents().then(setEvents);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4">All Events</h1>
      {events.map((event) => (
        <div key={event._id} className="border p-4 rounded">
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p>{event.date}</p>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

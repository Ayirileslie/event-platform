import { useEffect, useState } from "react";
import { listMyEvents } from "../api/events";
import { useNavigate } from "react-router-dom";

export default function MyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    listMyEvents().then(setEvents);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4">My Events</h1>
      {events.map((event) => (
        <div key={event._id} className="border p-4 rounded">
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p>{event.date}</p>
        </div>
      ))}
    </div>
  );
}


